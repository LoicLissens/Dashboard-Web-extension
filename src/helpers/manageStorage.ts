// @ts-ignore
import browser from "webextension-polyfill";

export enum StorageKeys {
    CATEGORIES = 'categories',
    THEME = 'theme',
    VIDEO = 'video',
    YOUTUBEAPIKEY = 'youtube',
    TASKS = 'tasks',
    NAME = 'name',
}
export enum Theme {
    LIGHT = 'light',
    DARK = 'dark',
}
export interface Task {
    id?: string,
    label?: string,
    hour?: string,
    done?: boolean,
}

export interface Video {
    title: string,
    thumbnail: string
    id: string,
}
export interface Channel {
    category: Category,
    channelId: string,
    uploadPlaylistId: string,
    name: string,
    description: string,
    country: string,
    defaultAvatrUrl: string,
    mediumAvatarUrl: string,
    highAvatarUrl: string,
    nbVideoToRetrieve: number
    hiddenVideos: Array<Video>
}

export type Category = string
export type Categories = Array<Category>
export type Channels = Array<Channel>
export type Tasks = Array<Task>


/**
 * A reusable function to store/update to local browser storage
 * @param {string} key - the key where is store the data
 * @param {any} payload - the data to store
 * @returns {promise}
 */
export const setTobrowserStorage = async (key: StorageKeys, payload: unknown): Promise<void> => {
    return await browser.storage.local.set({ [key]: payload })
}
/**
 * A reusable function to get data from local browser storage
 * @param {string} key - the key to retrieve data
 * @returns {promise}
 */
export const getFromBrowserStorage = async (key: StorageKeys): Promise<unknown | null> => {
    const prop = await browser.storage.local.get(key)
    return prop[key]

}
export const clearStorage = async (): Promise<void> => {
    await browser.storage.local.clear()
}
//Getters
export const getAllFromStorage = async () => {
    await browser.storage.local.get()
}
export const getVideosFromStorage = async (): Promise<Channels> => {
    const channels = await getFromBrowserStorage(StorageKeys.VIDEO) as Channels
    return channels ? [...channels] : [];
}
export const getCategoriesFromStorage = async (): Promise<Categories> => {
    const categories = await getFromBrowserStorage(StorageKeys.CATEGORIES) as Categories
    return categories ? [...categories] : []
}
export const getTasksFromStorage = async (): Promise<Tasks> => {
    const tasks = await getFromBrowserStorage(StorageKeys.TASKS) as Tasks
    return tasks ? [...tasks] : []
}
//setter
export const setVideosToStorage = async (payload: Channels): Promise<void> => {
    await setTobrowserStorage(StorageKeys.VIDEO, payload)
}
export const setCategoriesToStorage = async (payload: Categories): Promise<void> => {
    await setTobrowserStorage(StorageKeys.CATEGORIES, payload)
}
export const setTasksToStorage = async (payload: Tasks): Promise<void> => {
    await setTobrowserStorage(StorageKeys.TASKS, payload)
}
