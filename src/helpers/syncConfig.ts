/**
 * Config sync across machines.
 *
 * Two mechanisms, each doing what it is good at:
 *  - GitHub's blob `sha` DETECTS whether a conflict exists. It is server
 *    authoritative, so this does not depend on the machines' clocks agreeing.
 *  - Per-key `updatedAt` stamps RESOLVE one when it does, so editing a todo on
 *    one machine and adding a channel on another merges instead of one side
 *    winning wholesale.
 *
 * Merging per key also means deletions inside a list work without tombstones:
 * the array is the unit being replaced.
 */
import browser from "webextension-polyfill";
import {
    StorageKeys,
    SYNCED_KEYS,
    getFromBrowserStorage,
    getSyncMeta,
    setSyncMeta,
    type SyncMeta,
    type SyncedKey,
} from "./manageStorage";
import {
    ConflictError,
    readRemote,
    writeRemote,
    type SyncSettings,
} from "../services/githubSync";
import {
    SYNC_SCHEMA_VERSION,
    mergeEnvelopes,
    type SyncEntry,
    type SyncEnvelope as GenericSyncEnvelope,
} from "./syncMerge";

export { SYNC_SCHEMA_VERSION } from "./syncMerge";
export type SyncEnvelope = GenericSyncEnvelope<SyncedKey>;

export interface SyncState {
    lastSyncedSha: string | null;
    lastSyncedAt: number | null;
}

export type SyncOutcome = "up-to-date" | "pushed" | "pulled" | "merged";

export interface SyncResult {
    outcome: SyncOutcome;
    /** Keys whose local value was replaced by the remote's. */
    pulledKeys: SyncedKey[];
    /** Keys whose local value was newer and went to the remote. */
    pushedKeys: SyncedKey[];
    syncedAt: number;
}

export const getSyncSettings = async (): Promise<SyncSettings | null> => {
    const raw = await getFromBrowserStorage(StorageKeys.SYNC_SETTINGS);
    return (raw as SyncSettings) || null;
};

export const setSyncSettings = async (settings: SyncSettings): Promise<void> => {
    await browser.storage.local.set({ [StorageKeys.SYNC_SETTINGS]: settings });
};

export const getSyncState = async (): Promise<SyncState> => {
    const raw = await getFromBrowserStorage(StorageKeys.SYNC_STATE);
    return (raw as SyncState) || { lastSyncedSha: null, lastSyncedAt: null };
};

const setSyncState = async (state: SyncState): Promise<void> => {
    await browser.storage.local.set({ [StorageKeys.SYNC_STATE]: state });
};

/** Builds the envelope representing this device's current state. */
const buildLocalEnvelope = async (meta: SyncMeta): Promise<SyncEnvelope> => {
    const stored = await browser.storage.local.get();
    const entries: Partial<Record<SyncedKey, SyncEntry>> = {};
    let newest = 0;

    for (const key of SYNCED_KEYS) {
        const value = stored[key];
        if (value === undefined) continue;
        const updatedAt = meta[key] || 0;
        entries[key] = { value, updatedAt };
        if (updatedAt > newest) newest = updatedAt;
    }

    return { schemaVersion: SYNC_SCHEMA_VERSION, updatedAt: newest, entries };
};

/** Writes the keys the remote won into local storage, without re-stamping them. */
const applyPulledEntries = async (
    envelope: SyncEnvelope,
    pulledKeys: SyncedKey[],
    meta: SyncMeta,
): Promise<void> => {
    if (pulledKeys.length === 0) return;

    const payload: Record<string, unknown> = {};
    for (const key of pulledKeys) {
        const entry = envelope.entries[key];
        if (!entry) continue;
        payload[key] = entry.value;
        // Carry the remote's stamp across, so this device does not claim to
        // have authored a change it merely received.
        meta[key] = entry.updatedAt;
    }
    await browser.storage.local.set(payload);
};

/**
 * Runs one sync pass. Retries once on a 409, which means another machine wrote
 * between our read and our write.
 */
export const syncNow = async (attempt = 0): Promise<SyncResult> => {
    const settings = await getSyncSettings();
    if (!settings) {
        throw new Error("Sync is not configured");
    }

    const meta = await getSyncMeta();
    const local = await buildLocalEnvelope(meta);
    const remoteFile = await readRemote<SyncEnvelope>(settings);
    const remote = remoteFile ? remoteFile.content : null;

    if (remote && remote.schemaVersion > SYNC_SCHEMA_VERSION) {
        throw new Error(
            `Remote config uses schema v${remote.schemaVersion}; this device understands v${SYNC_SCHEMA_VERSION}. Update the extension first.`,
        );
    }

    const { merged, pulledKeys, pushedKeys } = mergeEnvelopes(SYNCED_KEYS, local, remote);

    await applyPulledEntries(merged, pulledKeys, meta);

    const needsPush = remoteFile === null || pushedKeys.length > 0;
    let sha = remoteFile ? remoteFile.sha : null;

    if (needsPush) {
        try {
            sha = await writeRemote(
                settings,
                merged,
                sha,
                `dashboard config sync (${new Date().toISOString()})`,
            );
        } catch (e) {
            if (e instanceof ConflictError && attempt === 0) {
                // Someone pushed mid-flight. Re-read and re-merge; the merge is
                // idempotent so a second pass converges.
                await setSyncMeta(meta);
                return syncNow(attempt + 1);
            }
            throw e;
        }
    }

    const syncedAt = Date.now();
    await setSyncMeta(meta);
    await setSyncState({ lastSyncedSha: sha, lastSyncedAt: syncedAt });

    let outcome: SyncOutcome = "up-to-date";
    if (pulledKeys.length > 0 && pushedKeys.length > 0) outcome = "merged";
    else if (pulledKeys.length > 0) outcome = "pulled";
    else if (needsPush) outcome = "pushed";

    return { outcome, pulledKeys, pushedKeys, syncedAt };
};
