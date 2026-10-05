import { readable } from "svelte/store";
import browser, { type Storage } from "webextension-polyfill";
import { StorageKeys } from "../helpers/manageStorage";
import { IDLE_STATE, type PomodoroState } from "../helpers/pomodoro";
import { readPomodoroState } from "../services/pomodoro";

export const pomodoro = readable<PomodoroState>(IDLE_STATE, (set) => {
    readPomodoroState().then(set);

    const onChanged = (changes: Record<string, Storage.StorageChange>, area: string) => {
        if (area !== "local" || !(StorageKeys.POMODORO in changes)) return;
        set((changes[StorageKeys.POMODORO].newValue as PomodoroState | undefined) ?? IDLE_STATE);
    };
    browser.storage.onChanged.addListener(onChanged);
    return () => browser.storage.onChanged.removeListener(onChanged);
});
