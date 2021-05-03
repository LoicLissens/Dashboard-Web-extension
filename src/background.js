import browser from "webextension-polyfill";

browser.browserAction.onClicked.addListener(() => {
  browser.tabs.create({'url':"chrome://newtab"})
})