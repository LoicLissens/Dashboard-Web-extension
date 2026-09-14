/**
 * Minimal GitHub Contents API client for config sync.
 *
 * Runs directly from the extension page: MV3's cross-origin clampdown applies
 * to content scripts, not extension pages, and this project has no content
 * scripts. `host_permissions` in the manifest covers api.github.com.
 *
 * Conflict detection is delegated to GitHub. Every file read returns a blob
 * `sha`; writing requires passing the `sha` you read. If another machine wrote
 * in between, GitHub rejects the write with 409 rather than clobbering it.
 * That is a real compare-and-swap, so correctness does not depend on the two
 * machines' clocks agreeing.
 */

const API_ROOT = "https://api.github.com";

export interface SyncSettings {
    /** Fine-grained PAT with Contents read/write on this repo only. */
    token: string;
    owner: string;
    repo: string;
    /** Path of the JSON file inside the repo, e.g. "dashboard-config.json". */
    path: string;
    /** Optional; GitHub uses the repo's default branch when omitted. */
    branch?: string;
}

export interface RemoteFile<T> {
    content: T;
    sha: string;
}

/** Thrown when the remote moved since the sha we were given. */
export class ConflictError extends Error {
    constructor() {
        super("Remote changed since last read");
        this.name = "ConflictError";
    }
}

export class GithubSyncError extends Error {
    readonly status: number;
    constructor(status: number, message: string) {
        super(message);
        this.name = "GithubSyncError";
        this.status = status;
    }
}

function utf8ToBase64(input: string): string {
    const bytes = new TextEncoder().encode(input);
    let binary = "";
    // Chunked so a large config cannot blow the argument limit of fromCharCode.
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
}

function base64ToUtf8(input: string): string {
    // GitHub wraps its base64 payloads at 60 chars.
    const binary = atob(input.replace(/\s/g, ""));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
}

function contentsUrl(settings: SyncSettings): string {
    const { owner, repo, path } = settings;
    return `${API_ROOT}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`;
}

function headers(settings: SyncSettings): Record<string, string> {
    return {
        Authorization: `Bearer ${settings.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
    };
}

/**
 * Reads the config file. Returns null when the file does not exist yet, which
 * is the normal first-run state rather than an error.
 */
export async function readRemote<T>(settings: SyncSettings): Promise<RemoteFile<T> | null> {
    const url = new URL(contentsUrl(settings));
    if (settings.branch) {
        url.searchParams.set("ref", settings.branch);
    }
    const resp = await fetch(url.toString(), { headers: headers(settings) });

    if (resp.status === 404) {
        return null;
    }
    if (!resp.ok) {
        throw new GithubSyncError(resp.status, await describeFailure(resp));
    }

    const body = await resp.json();
    return { content: JSON.parse(base64ToUtf8(body.content)) as T, sha: body.sha };
}

/**
 * Writes the config file. Pass the `sha` from the matching read, or null to
 * create the file. A 409 (or the 422 GitHub returns for a stale sha) surfaces
 * as ConflictError so the caller can re-read and re-merge.
 */
export async function writeRemote<T>(
    settings: SyncSettings,
    content: T,
    sha: string | null,
    message: string,
): Promise<string> {
    const body: Record<string, unknown> = {
        message,
        content: utf8ToBase64(JSON.stringify(content, null, 2)),
    };
    if (sha) body.sha = sha;
    if (settings.branch) body.branch = settings.branch;

    const resp = await fetch(contentsUrl(settings), {
        method: "PUT",
        headers: headers(settings),
        body: JSON.stringify(body),
    });

    if (resp.status === 409 || resp.status === 422) {
        throw new ConflictError();
    }
    if (!resp.ok) {
        throw new GithubSyncError(resp.status, await describeFailure(resp));
    }

    const result = await resp.json();
    return result.content.sha as string;
}

async function describeFailure(resp: Response): Promise<string> {
    let detail = "";
    try {
        const body = await resp.json();
        detail = body && body.message ? `: ${body.message}` : "";
    } catch (e) {
        // Non-JSON error body; the status alone will have to do.
    }
    if (resp.status === 401) return `Bad or expired token${detail}`;
    if (resp.status === 403) return `Forbidden -- check the token's Contents permission${detail}`;
    if (resp.status === 404) return `Repo or path not found${detail}`;
    return `GitHub returned ${resp.status}${detail}`;
}
