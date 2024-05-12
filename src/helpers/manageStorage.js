import browser from "webextension-polyfill";
/**
 * A reusable function to store/update to local browser storage
 * @param {string} key - the key where is store the data
 * @param {any} payload - the data to store
 * @returns {promise}
 */
export const setTobrowserStorage = (key, payload) => {
    return browser.storage.local.set({ [key]: payload })
}
/**
 * A reusable function to get data from local browser storage
 * @param {string} key - the key to retrieve data
 * @returns {promise}
 */
export const getFromBrowserStorage = async (key) => {
    const prop = await browser.storage.local.get(key)
    return prop[key]

}
export const storageKeys = {
    CATEGORIES: 'categories',
    THEME: 'theme',
    VIDEO: 'video',
    YOUTUBEAPIKEY: 'youtubeApiKey',
    TASKS: 'tasks',
    NAME: 'name',
}