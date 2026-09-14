# Dashboard Web Extension

Replaces the new-tab page with a personal dashboard: greeting, weather, todo
list and YouTube channel feeds. Svelte 4 + TypeScript + Tailwind 4 / daisyUI 5,
bundled with Rollup.

## Install

```bash
npm install
npm run build      # or: npm run dev
```

Then in Brave/Chrome: **Extensions -> Manage extensions -> Developer mode ->
Load unpacked**, and select the **`public`** folder (not the repo root).

Open a new tab. On first run it asks for your name; everything else is
configured from the gear icon in the navbar.

## API keys

Both keys are entered in the UI at runtime and stored in `chrome.storage.local`.
Neither belongs in `.env`, the source tree, or a commit.

### 1. YouTube Data API key — required for the Videos view

Without it the Videos tab just says "API Key not provided".

1. Go to the [Google Cloud console](https://console.cloud.google.com/), create
   (or pick) a project
2. **APIs & Services -> Library**, enable **YouTube Data API v3**
3. **APIs & Services -> Credentials -> Create credentials -> API key**
4. Restrict it (recommended): **API restrictions -> YouTube Data API v3**
5. In the dashboard: **gear icon -> Videos tab -> "Youtube API Key"**, paste,
   press Enter

The pencil icon re-enables the field to change it later; the eye icon reveals it.

Note this key **is** included in the synced config (see below), which is why the
sync repo must be private.

### 2. GitHub token — only if you want config sync

Used to read/write one JSON file in a private repo. Skip this if you only use
one machine.

**Create the repo first** — a private repo, empty is fine. The config file is
created on the first sync.

**Create a fine-grained token** (not a classic one — classic tokens grant
account-wide scopes):

1. GitHub -> **Settings -> Developer settings -> Personal access tokens ->
   Fine-grained tokens -> Generate new token**
2. **Repository access -> Only select repositories** -> pick that one repo
3. **Permissions -> Repository permissions -> Contents: Read and write**
   (leave everything else at "No access")
4. Set an **expiration** — rotating means re-pasting it here, nothing more

**Enter it** in the dashboard: **gear icon -> General tab -> "Config sync"**:

| Field | Example | Notes |
|---|---|---|
| owner | `LoicLissens` | GitHub user or org |
| repo | `dashboard-config` | The private repo |
| path in repo | `dashboard-config.json` | Created on first sync |
| branch | *(blank)* | Blank uses the repo's default branch |
| token | `github_pat_...` | The fine-grained PAT |

Then **Sync now**. Repeat on the second machine with the same repo and its own
token — the first sync there pulls everything down.

### Where the keys live

Both sit in `chrome.storage.local`, on disk in your browser profile under
`Local Extension Settings/<extension-id>/`. **This is not encrypted.** Anyone
with access to that profile directory can read them. The extension sandbox keeps
other websites out; it is not protection against local access.

The GitHub token is excluded from the synced payload *and* from the config file
you download via **Download** — it never leaves the machine that entered it.
Each computer gets its own.

## Config sync

Stores the config as JSON in a **private** GitHub repo. A secret gist is
*unlisted*, not private, and the config carries the YouTube key — so use a repo.

Conflicts are detected by GitHub: each read returns a blob `sha`, and a write
must present it, so a machine writing against a stale `sha` gets a 409 instead
of clobbering. Resolution is per key using `updatedAt` stamps, so a todo edited
on one machine and a channel added on another both survive.

| | |
|---|---|
| **Synced** | categories, theme, channels, tasks, name, YouTube API key |
| **Not synced** | weather cache (device geolocation), sync settings and token |

After a sync that pulls changes, the page reloads so components pick them up.

## Finding a YouTube channel ID

Channels are added by URL in **Videos -> Register a channel**, which resolves the
handle automatically. If you need the raw ID:

```bash
source chanelid.bash && get_yt_channel_id "https://www.youtube.com/@grafikart"
```

or `curl -s <channel-url> | grep -o 'https://www.youtube.com/channel/[^"]*' | head -n 1 | awk -F/ '{print $NF}'`,
or [this guide](https://mixedanalytics.com/blog/find-a-youtube-channel-id/).

## Development

| Command | What it does |
|---|---|
| `npm run dev` | Tailwind CLI watch + Rollup watch, in parallel |
| `npm run build` | Both, once, minified |
| `npm run validate` | `svelte-check --fail-on-warnings` |
| `npm run typecheck` | `tsc --noEmit` |

Styling is Tailwind 4 + daisyUI 5, configured entirely in `src/app.css` — there
is no `tailwind.config.js`. The stylesheet is built **outside** Rollup, so
component `<style>` blocks cannot use `@apply`; use utility classes in markup.

Theme is a daisyUI `data-theme` attribute on `<html>`, persisted to
`chrome.storage` and mirrored into `localStorage` so the inline script in
`index.html` can apply it before first paint.

After changing anything, reload the extension from the extensions page — a new
tab alone will not pick up a rebuilt bundle.
