import browser from "webextension-polyfill";
import { StorageKeys } from "../helpers/manageStorage";
import { IDLE_STATE, type PomodoroState } from "../helpers/pomodoro";

export const POMODORO_ALARM = "pomodoro";

export const readPomodoroState = async (): Promise<PomodoroState> => {
    const stored = await browser.storage.local.get(StorageKeys.POMODORO);
    return (stored[StorageKeys.POMODORO] as PomodoroState | undefined) ?? IDLE_STATE;
};

export const applyPomodoroState = async (next: PomodoroState): Promise<void> => {
    await browser.storage.local.set({ [StorageKeys.POMODORO]: next });
    await browser.alarms.clear(POMODORO_ALARM);
    if (next.endsAt !== null) {
        await browser.alarms.create(POMODORO_ALARM, { when: next.endsAt });
    }
};
