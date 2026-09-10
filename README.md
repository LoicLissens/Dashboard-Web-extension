Into chrome extension menu, load unpacked extension and chose the public folder
Installing dependenies: `npm install`, then `npm run build` (or  `npm run dev`)

`build` / `dev` each run two steps in parallel: the Tailwind CLI (`src/app.css`
-> `public/build/tailwind.css`) and Rollup (`src/main.ts` -> `public/build/bundle.js`).

Styling is Tailwind 4 + daisyUI 5, configured entirely in `src/app.css` -- there
is no `tailwind.config.js`. Because the stylesheet is built outside Rollup,
component `<style>` blocks cannot use `@apply`; use utility classes in markup.

Theme is a daisyUI `data-theme` attribute on `<html>`, toggled by
`src/components/Theme.svelte`, persisted to `chrome.storage` and mirrored into
`localStorage` so the inline script in `index.html` can apply it before first
paint.

Checks: `npm run validate` (svelte-check) and `npm run typecheck` (tsc).

(tedious but remporary) [find channel id ](https://mixedanalytics.com/blog/find-a-youtube-channel-id/) or
`curl -s url_of_yt_channel | grep -o 'https://www.youtube.com/channel/[^"]*' | head -n 1 | awk -F/ '{print $NF}'`
or use the bash script `source chanelid.bash` then `get_yt_channel_id "link" `