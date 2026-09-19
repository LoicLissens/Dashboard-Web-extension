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

// A recurrence with no UNTIL and no COUNT expands forever. The range end stops
// the iteration in practice; this is the backstop for a feed that also carries
// a nonsense DTSTART far in the past.
const MAX_OCCURRENCES_PER_EVENT = 750;

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

    const iterator = event.iterator();
    for (let seen = 0; seen < MAX_OCCURRENCES_PER_EVENT; seen += 1) {
        const next = iterator.next();
        if (!next) return;

        const details = event.getOccurrenceDetails(next);
        const start = details.startDate.toJSDate();
        // Occurrences arrive in ascending order, so the first one past the
        // window means every later one is too.
        if (start >= range.to) return;

        // `item` is the override component for a modified instance and the
        // master otherwise, so a single cancelled instance drops out here.
        if (isCancelled(details.item.component)) continue;

        const occurrence = toCalendarEvent(details.item, details.startDate, details.endDate, origin);
        if (overlaps(occurrence, range)) out.push(occurrence);
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
