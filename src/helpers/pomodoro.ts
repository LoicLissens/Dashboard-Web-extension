export type PomodoroPhase = "idle" | "work" | "break";

export interface PomodoroState {
    phase: PomodoroPhase;
    endsAt: number | null;
    completedSessions: number;
}

export const WORK_MINUTES = 25;
export const SHORT_BREAK_MINUTES = 5;
export const LONG_BREAK_MINUTES = 15;
export const SESSIONS_PER_CYCLE = 4;

export const IDLE_STATE: PomodoroState = { phase: "idle", endsAt: null, completedSessions: 0 };

const minutes = (n: number) => n * 60_000;

export const isLongBreak = (state: PomodoroState): boolean =>
    state.phase === "break" &&
    state.completedSessions > 0 &&
    state.completedSessions % SESSIONS_PER_CYCLE === 0;

export const startSession = (state: PomodoroState, now: number): PomodoroState => ({
    phase: "work",
    endsAt: now + minutes(WORK_MINUTES),
    completedSessions: state.completedSessions,
});

export const finishPhase = (state: PomodoroState, now: number): PomodoroState => {
    if (state.phase === "work") {
        const completedSessions = state.completedSessions + 1;
        const long = completedSessions % SESSIONS_PER_CYCLE === 0;
        return {
            phase: "break",
            endsAt: now + minutes(long ? LONG_BREAK_MINUTES : SHORT_BREAK_MINUTES),
            completedSessions,
        };
    }
    if (state.phase === "break") {
        return { ...IDLE_STATE, completedSessions: isLongBreak(state) ? 0 : state.completedSessions };
    }
    return state;
};
