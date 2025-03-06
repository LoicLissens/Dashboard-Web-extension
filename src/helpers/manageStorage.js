import browser from "webextension-polyfill";
export const storageKeys = {
    CATEGORIES: 'categories',
    THEME: 'theme',
    VIDEO: 'video',
    YOUTUBEAPIKEY: 'youtubeApiKey',
    TASKS: 'tasks',
    NAME: 'name',
}
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
export const clearStorage = async () => {
    await browser.storage.local.clear()
}
//Getters
export const getAllFromStorage = async () => {
    await browser.storage.local.get()
}
export const getVideosFromStorage = async () => {
    return await getFromBrowserStorage(storageKeys.VIDEO)
}
export const getCategoriesFromStorage = async () => {
    return await getFromBrowserStorage(storageKeys.CATEGORIES)
}
//setter
export const setVideosToStorage = async (payload) => {
    await setTobrowserStorage(storageKeys.VIDEO, payload)
}
export const setCategoriesToStorage = async (payload) => {
    await setTobrowserStorage(storageKeys.CATEGORIES, payload)
}
