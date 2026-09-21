import ICAL from "ical.js";

type IcalComponent = InstanceType<typeof ICAL.Component>;
type IcalEvent = InstanceType<typeof ICAL.Event>;
type IcalTime = InstanceType<typeof ICAL.Time>;

export type CalendarSource = "google" | "proton";

export interface DateRange {
    /** Inclusive lower bound. */
    from: Date;
    /** Exclusive upper bound. */
    to: Date;
}

/** Which feed an event came from, stamped onto every event it yields. */
export interface EventOrigin {
    feedId: string;
    source: CalendarSource;
}

export interface CalendarEvent {
    /** Unique per feed and per occurrence, so recurring events do not collide. */
    id: string;
    uid: string;
    feedId: string;
    source: CalendarSource;
    title: string;
    description: string;
    location: string;
    start: Date;
    /** Exclusive, as in iCalendar: an all-day event on the 5th ends on the 6th. */
    end: Date;
    allDay: boolean;
}

// Two separate budgets, because they guard different things.
//
// Occurrences are only ever walked forward from DTSTART: ICAL's iterator cannot
// seek, and re-anchoring it at the range start would change what rules like
// FREQ=MONTHLY;BYDAY=1MO even mean. So a daily event running since 2019 costs
// ~2500 steps before it reaches today -- those steps must not count against the
// number of events we are willing to return, or the event silently vanishes.
const MAX_EVENTS_PER_RECURRENCE = 750;
const MAX_STEPS_PER_RECURRENCE = 100_000;

/**
 * Turn one iCalendar document into the events that overlap `range`.
 *
 * Recurrences are expanded and RECURRENCE-ID overrides applied, so a moved or
 * cancelled instance of a weekly meeting shows up moved or not at all.
 */
export function parseIcs(ics: string, range: DateRange, origin: EventOrigin): CalendarEvent[] {
    const root = new ICAL.Component(ICAL.parse(ics));
    registerTimezones(root);

    const vevents = root.getAllSubcomponents("vevent");
    const exceptionsByUid = new Map<string, IcalComponent[]>();
    const masters: IcalComponent[] = [];

    for (const vevent of vevents) {
        if (!vevent.getFirstPropertyValue("recurrence-id")) {
            masters.push(vevent);
            continue;
        }
        const uid = readString(vevent, "uid");
        if (!uid) continue;
        const existing = exceptionsByUid.get(uid);
        if (existing) existing.push(vevent);
        else exceptionsByUid.set(uid, [vevent]);
    }

    const events: CalendarEvent[] = [];
    for (const master of masters) {
        const event = new ICAL.Event(master);
        for (const exception of exceptionsByUid.get(event.uid) || []) {
            event.relateException(exception);
        }
        collectOccurrences(event, range, origin, events);
    }

    events.sort((a, b) => a.start.getTime() - b.start.getTime());
    return events;
}

/**
 * VTIMEZONE definitions land in ICAL's process-wide registry, so a TZID already
 * registered by another feed wins. Two feeds disagreeing about what "Europe/
 * Brussels" means is not a real scenario; overwriting on every parse would be
 * the more surprising behaviour.
 */
function registerTimezones(root: IcalComponent): void {
    for (const vtimezone of root.getAllSubcomponents("vtimezone")) {
        const tzid = readString(vtimezone, "tzid");
        if (tzid && !ICAL.TimezoneService.has(tzid)) {
            ICAL.TimezoneService.register(vtimezone);
        }
    }
}

function collectOccurrences(
    event: IcalEvent,
    range: DateRange,
    origin: EventOrigin,
    out: CalendarEvent[],
): void {
    if (!event.isRecurring()) {
        if (isCancelled(event.component)) return;
        const occurrence = toCalendarEvent(event, event.startDate, event.endDate, origin);
        if (overlaps(occurrence, range)) out.push(occurrence);
        return;
    }

    // An occurrence starting before the window can still run into it, so the
    // cheap skip below has to allow for the event's own length.
    const durationMs = Math.max(
        0,
        event.endDate.toJSDate().getTime() - event.startDate.toJSDate().getTime(),
    );
    const earliestRelevant = range.from.getTime() - durationMs;
    const rangeEnd = range.to.getTime();

    const iterator = event.iterator();
    let emitted = 0;

    for (let step = 0; step < MAX_STEPS_PER_RECURRENCE; step += 1) {
        const next = iterator.next();
        if (!next) return;

        // Occurrences arrive in ascending order, so the first one past the
        // window means every later one is too.
        const startMs = next.toJSDate().getTime();
        if (startMs >= rangeEnd) return;
        // Still behind the window: step over it without paying for
        // getOccurrenceDetails, and without spending the event budget.
        if (startMs < earliestRelevant) continue;

        const details = event.getOccurrenceDetails(next);

        // `item` is the override component for a modified instance and the
        // master otherwise, so a single cancelled instance drops out here.
        if (isCancelled(details.item.component)) continue;

        const occurrence = toCalendarEvent(details.item, details.startDate, details.endDate, origin);
        if (!overlaps(occurrence, range)) continue;

        out.push(occurrence);
        emitted += 1;
        if (emitted >= MAX_EVENTS_PER_RECURRENCE) return;
    }
}

function toCalendarEvent(
    event: IcalEvent,
    startDate: IcalTime,
    endDate: IcalTime,
    origin: EventOrigin,
): CalendarEvent {
    const start = startDate.toJSDate();
    return {
        id: `${origin.feedId}:${event.uid}:${start.toISOString()}`,
        uid: event.uid,
        feedId: origin.feedId,
        source: origin.source,
        title: event.summary || "(no title)",
        description: event.description || "",
        location: event.location || "",
        start,
        end: endDate.toJSDate(),
        allDay: startDate.isDate,
    };
}

function overlaps(event: CalendarEvent, range: DateRange): boolean {
    return event.end > range.from && event.start < range.to;
}

function isCancelled(component: IcalComponent): boolean {
    return readString(component, "status") === "CANCELLED";
}

/** `getFirstPropertyValue` is typed as a union of every jCal value kind. */
function readString(component: IcalComponent, name: string): string | null {
    const value = component.getFirstPropertyValue(name);
    return typeof value === "string" ? value : null;
}
