import browser from "webextension-polyfill";

// TODO: this listener never fires. public/manifest.json declares
// `manifest_version: 3` but registers this file through the MV2-shaped
// `background.scripts` + `persistent` keys; MV3 requires
// `background.service_worker`. Fixing that is a separate change.
browser.action.onClicked.addListener(() => {
  browser.tabs.create({ url: "chrome://newtab" })
})
