import browser from "webextension-polyfill";
import {
  finishPhase,
  isLongBreak,
  LONG_BREAK_MINUTES,
  SESSIONS_PER_CYCLE,
  SHORT_BREAK_MINUTES,
} from "./helpers/pomodoro";
import { POMODORO_ALARM, applyPomodoroState, readPomodoroState } from "./services/pomodoro";

browser.action.onClicked.addListener(() => {
  browser.tabs.create({})
})

browser.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== POMODORO_ALARM) return;
  const state = await readPomodoroState();
  if (state.phase === "idle") return;

  const next = finishPhase(state, Date.now());
  await applyPomodoroState(next);

  const message =
    next.phase === "break"
      ? isLongBreak(next)
        ? `${LONG_BREAK_MINUTES}-minute long break. ${SESSIONS_PER_CYCLE} sessions done.`
        : `${SHORT_BREAK_MINUTES}-minute break.`
      : "Start your next session from the dashboard.";
  await browser.notifications.create(POMODORO_ALARM, {
    type: "basic",
    iconUrl: browser.runtime.getURL("favicon.png"),
    title: next.phase === "break" ? "Time for a break" : "Back to work",
    message,
  });
});

const rearm = async () => {
  const state = await readPomodoroState();
  if (state.endsAt !== null) await applyPomodoroState(state);
};
browser.runtime.onStartup.addListener(rearm);
browser.runtime.onInstalled.addListener(rearm);
