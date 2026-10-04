import { derived, readable } from "svelte/store";
import { getCalendarConfigFromStorage } from "../helpers/manageStorage";
import {
    createProvider,
    fetchCalendarEvents,
    rangeForDays,
    IcsTextProvider,
    type CalendarEvent,
} from "../services/calendarAPI";
import { dayKey } from "../helpers/time";

export interface CalendarState {
    isLoading: boolean;
    hasFeeds: boolean;
    events: CalendarEvent[];
    errors: string[];
    snapshots: { label: string; importedAt: number }[];
}

const initialState: CalendarState = {
    isLoading: true,
    hasFeeds: false,
    events: [],
    errors: [],
    snapshots: [],
};

async function load(): Promise<CalendarState> {
    const config = await getCalendarConfigFromStorage();
    if (config.feeds.length === 0) {
        return { ...initialState, isLoading: false };
    }

    const providers = config.feeds.map(createProvider);
    const result = await fetchCalendarEvents(providers, rangeForDays(config.daysAhead));
    return {
        isLoading: false,
        hasFeeds: true,
        events: result.events,
        errors: result.errors.map((e) => e.message),
        snapshots: providers
            .filter((p): p is IcsTextProvider => p instanceof IcsTextProvider)
            .map((p) => ({ label: p.label, importedAt: p.importedAt })),
    };
}

export const calendar = readable<CalendarState>(initialState, (set) => {
    load().then(set, (e) =>
        set({ ...initialState, isLoading: false, hasFeeds: true, errors: [String(e)] }),
    );
});

export const eventsTodayCount = derived(calendar, ($calendar) => {
    const today = dayKey(new Date());
    return $calendar.events.filter((event) => dayKey(event.start) === today).length;
});
