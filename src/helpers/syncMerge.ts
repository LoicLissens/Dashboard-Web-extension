export const SYNC_SCHEMA_VERSION = 1;

export interface SyncEntry {
    value: unknown;
    updatedAt: number;
}

export interface SyncEnvelope<K extends string = string> {
    schemaVersion: number;
    updatedAt: number;
    entries: Partial<Record<K, SyncEntry>>;
}

export interface MergeOutput<K extends string> {
    merged: SyncEnvelope<K>;
    /** Keys whose local value loses to the remote's. */
    pulledKeys: K[];
    /** Keys whose local value is newer and should go to the remote. */
    pushedKeys: K[];
}

export function mergeEnvelopes<K extends string>(
    keys: readonly K[],
    local: SyncEnvelope<K>,
    remote: SyncEnvelope<K> | null,
): MergeOutput<K> {
    const pulledKeys: K[] = [];
    const pushedKeys: K[] = [];
    const entries: Partial<Record<K, SyncEntry>> = {};

    for (const key of keys) {
        const localEntry = local.entries[key];
        const remoteEntry = remote ? remote.entries[key] : undefined;

        if (localEntry && remoteEntry) {
            if (remoteEntry.updatedAt > localEntry.updatedAt) {
                entries[key] = remoteEntry;
                pulledKeys.push(key);
            } else {
                entries[key] = localEntry;
                if (localEntry.updatedAt > remoteEntry.updatedAt) pushedKeys.push(key);
            }
        } else if (remoteEntry) {
            entries[key] = remoteEntry;
            pulledKeys.push(key);
        } else if (localEntry) {
            entries[key] = localEntry;
            pushedKeys.push(key);
        }
    }

    let newest = 0;
    for (const key of keys) {
        const entry = entries[key];
        if (entry && entry.updatedAt > newest) newest = entry.updatedAt;
    }

    return {
        merged: { schemaVersion: SYNC_SCHEMA_VERSION, updatedAt: newest, entries },
        pulledKeys,
        pushedKeys,
    };
}
