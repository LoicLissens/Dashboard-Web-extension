import browser from "webextension-polyfill";
import { z } from "zod";
export enum StorageKeys {
    CATEGORIES = 'categories',
    THEME = 'theme',
    VIDEO = 'video',
    YOUTUBEAPIKEY = 'youtube',
    TASKS = 'tasks',
    NAME = 'name',
    METEO_CACHE = 'meteoCache',
    CALENDAR = 'calendar',
    SYNC_SETTINGS = 'syncSettings',
    SYNC_STATE = 'syncState',
    SYNC_META = 'syncMeta',
}

export const SYNCED_KEYS = [
    StorageKeys.CATEGORIES,
    StorageKeys.THEME,
    StorageKeys.VIDEO,
    StorageKeys.YOUTUBEAPIKEY,
    StorageKeys.TASKS,
    StorageKeys.NAME,
] as const;

export type SyncedKey = typeof SYNCED_KEYS[number];

const SYNCED_KEY_SET: Set<string> = new Set(SYNCED_KEYS);

export type SyncMeta = Partial<Record<SyncedKey, number>>;

export enum Theme {
    LIGHT = 'light',
    DARK = 'dark',
}
export enum Page {
    HOME = 'Home',
    VIDEOS = 'Videos',
}
export const VideoSchema = z.object({
    title: z.string(),
    thumbnail: z.string(),
    id: z.string(),
});

export const TaskSchema = z.object({
    id: z.string().optional(),
    label: z.string(),
    hour: z.string().optional(),
    done: z.boolean().optional(),
});

export const ChannelSchema = z.object({
    category: z.string(),
    channelId: z.string(),
    uploadPlaylistId: z.string(),
    name: z.string(),
    defaultAvatrUrl: z.string(),
    nbVideoToRetrieve: z.number(),
    hiddenVideos: z.array(VideoSchema),
    description: z.string().optional(),
    country: z.string().optional(),
    mediumAvatarUrl: z.string().optional(),
    highAvatarUrl: z.string().optional(),
});

export const MeteoCacheSchema = z.object({
    createdAt: z.number(),
    currTemp: z.number(),
    currUnit: z.string(),
    todayMaxTemp: z.number(),
    todayMinTemp: z.number(),
    todayUnit: z.string(),
});

/**
 * A feed is either a live URL we re-fetch, or the text of an .ics exported by
 * hand. Proton gates share links behind a paid plan, so a free account has only
 * the export -- a snapshot, which is why `importedAt` is not optional: the UI
 * has to be able to say how old it is.
 */
export const CalendarFeedSchema = z.discriminatedUnion("kind", [
    z.object({
        kind: z.literal("url"),
        id: z.string(),
        label: z.string(),
        source: z.enum(["google", "proton"]),
        url: z.string().url(),
    }),
    z.object({
        kind: z.literal("file"),
        id: z.string(),
        label: z.string(),
        source: z.enum(["google", "proton"]),
        ics: z.string(),
        importedAt: z.number(),
    }),
]);

export const CalendarConfigSchema = z.object({
    feeds: z.array(CalendarFeedSchema),
    daysAhead: z.number().int().min(1).max(365),
});

export type Video = z.infer<typeof VideoSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type Channel = z.infer<typeof ChannelSchema>;
export type MeteoCache = z.infer<typeof MeteoCacheSchema>;
export type CalendarConfig = z.infer<typeof CalendarConfigSchema>;

export const DEFAULT_CALENDAR_CONFIG: CalendarConfig = { feeds: [], daysAhead: 14 };

export type Category = string
export type Categories = Array<Category>
export type Channels = Array<Channel>
export type Tasks = Array<Task>

export const OptionalUserConfigSchema = z.object({
    categories: z.array(z.string()),
    theme: z.nativeEnum(Theme),
    youtube: z.string().regex(/^[A-Za-z0-9_-]+$/, {
        message: "La clé API YouTube doit être au format valide"
    }),
    tasks: z.array(TaskSchema),
    video: z.array(ChannelSchema),
}).partial()
export const UserConfigSchema = OptionalUserConfigSchema.extend({
    configVersion: z.string(),
    name: z.string(),
})
export type UserConfig = z.infer<typeof UserConfigSchema>;

export function validateUserConfig(config: unknown): UserConfig {
    const result = UserConfigSchema.safeParse(config);
    if (result.success) {
        return result.data;
    } else {
        throw new Error(`Invalid user config: ${result.error}`);
    }
}
/**
 * A reusable function to store/update to local browser storage
 * @param {string} key - the key where is store the data
 * @param {any} payload - the data to store
 * @returns {promise}
 */
export const setTobrowserStorage = async (key: StorageKeys, payload: unknown): Promise<void> => {
    await browser.storage.local.set({ [key]: payload })
    if (SYNCED_KEY_SET.has(key)) {
        await markKeyUpdated(key as SyncedKey)
    }
}

export const markKeyUpdated = async (key: SyncedKey, at: number = Date.now()): Promise<void> => {
    const meta = await getSyncMeta()
    meta[key] = at
    await browser.storage.local.set({ [StorageKeys.SYNC_META]: meta })
}

export const getSyncMeta = async (): Promise<SyncMeta> => {
    const meta = await getFromBrowserStorage(StorageKeys.SYNC_META)
    return (meta as SyncMeta) || {}
}

export const setSyncMeta = async (meta: SyncMeta): Promise<void> => {
    await browser.storage.local.set({ [StorageKeys.SYNC_META]: meta })
}
/**
 * A reusable function to get data from local browser storage
 * @param {string} key - the key to retrieve data
 * @returns {promise}
 */
export const getFromBrowserStorage = async (key: StorageKeys): Promise<unknown> => {
    const prop = await browser.storage.local.get(key)
    return prop[key]

}
export const clearStorage = async (): Promise<void> => {
    await browser.storage.local.clear()
}


//Getters
export const getAllFromStorage = async () => {
    return await browser.storage.local.get()
}
export const getUserConfigFromStorage = async ():Promise<UserConfig> => {
    const fullStorage = await browser.storage.local.get()
    const excluded: string[] = [
        StorageKeys.METEO_CACHE,
        // Holds a Google secret address (a bearer credential) and the raw text
        // of an exported calendar (actual event content). Neither belongs in a
        // downloadable config file, for the same reason as the GitHub token.
        StorageKeys.CALENDAR,
        StorageKeys.SYNC_SETTINGS,
        StorageKeys.SYNC_STATE,
        StorageKeys.SYNC_META,
    ]
    return Object.fromEntries(
        Object.entries(fullStorage).filter(([key]) => !excluded.includes(key))
      ) as UserConfig;

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
export const getMeteoCacheFromStorage = async (): Promise<MeteoCache> => {
    return await getFromBrowserStorage(StorageKeys.METEO_CACHE) as MeteoCache
}
export const getCalendarConfigFromStorage = async (): Promise<CalendarConfig> => {
    const raw = await getFromBrowserStorage(StorageKeys.CALENDAR)
    const result = CalendarConfigSchema.safeParse(raw)
    // A malformed blob would otherwise break every new tab with no way back in
    // through the UI, so fall back rather than throw.
    return result.success ? result.data : { ...DEFAULT_CALENDAR_CONFIG }
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
export const setFullConfigToStorage = async (payload: UserConfig): Promise<void> => {
    await browser.storage.local.set(payload)
}
export const setMeteoCacheToStorage = async (payload: MeteoCache): Promise<void> => {
    await setTobrowserStorage(StorageKeys.METEO_CACHE, payload)
}
export const setCalendarConfigToStorage = async (payload: CalendarConfig): Promise<void> => {
    // Deliberately absent from SYNCED_KEYS: see the exclusion note above.
    await setTobrowserStorage(StorageKeys.CALENDAR, payload)
}