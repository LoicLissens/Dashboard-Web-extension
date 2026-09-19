import { parseIcs, type CalendarEvent, type CalendarSource, type DateRange } from "./icsParser";

export type { CalendarEvent, CalendarSource, DateRange } from "./icsParser";

/** A feed is one pasted URL: the thing the settings tab will collect. */
export interface CalendarFeed {
    id: string;
    label: string;
    source: CalendarSource;
    /**
     * Google: Settings -> <calendar> -> "Secret address in iCal format".
     * Proton: Share -> "Share with anyone" -> Full view link.
     *
     * Either URL is a bearer credential: holding it is read access.
     */
    url: string;
}

export class CalendarFeedError extends Error {
    readonly feedId: string;
    readonly status: number | null;

    constructor(feedId: string, message: string, status: number | null = null) {
        super(message);
        this.name = "CalendarFeedError";
        this.feedId = feedId;
        this.status = status;
    }
}

/**
 * What a calendar backend has to provide. Today both feeds are ICS URLs; if
 * Google's cached export turns out to lag, a `GoogleOAuthProvider` implementing
 * this interface swaps in at `createProvider` and nothing above it changes.
 */
export interface CalendarProvider {
    readonly id: string;
    readonly label: string;
    readonly source: CalendarSource;
    fetchEvents(range: DateRange): Promise<CalendarEvent[]>;
}

const FETCH_TIMEOUT_MS = 15_000;

export class IcsFeedProvider implements CalendarProvider {
    readonly id: string;
    readonly label: string;
    readonly source: CalendarSource;
    private readonly url: string;

    constructor(feed: CalendarFeed) {
        this.id = feed.id;
        this.label = feed.label;
        this.source = feed.source;
        this.url = feed.url;
    }

    async fetchEvents(range: DateRange): Promise<CalendarEvent[]> {
        const ics = await this.fetchIcs();
        try {
            return parseIcs(ics, range, { feedId: this.id, source: this.source });
        } catch (e) {
            const detail = e instanceof Error ? e.message : String(e);
            throw new CalendarFeedError(this.id, `Feed is not readable iCalendar: ${detail}`);
        }
    }

    private async fetchIcs(): Promise<string> {
        let resp: Response;
        try {
            resp = await fetch(this.url, {
                // Both endpoints are cached upstream; no point letting the HTTP
                // cache add another layer of staleness on top.
                cache: "no-store",
                signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            });
        } catch (e) {
            // Also where a missing host_permissions entry surfaces: the request
            // is blocked as a CORS failure with no status to report.
            const detail = e instanceof Error ? e.message : String(e);
            throw new CalendarFeedError(this.id, `Could not reach the feed (${detail})`);
        }

        if (!resp.ok) {
            throw new CalendarFeedError(this.id, describeFailure(resp.status), resp.status);
        }
        return resp.text();
    }
}

function describeFailure(status: number): string {
    if (status === 401 || status === 403) return `Feed rejected the request (${status}) -- the link may have been revoked`;
    if (status === 404) return "Feed not found -- the link may have been revoked or mistyped";
    if (status === 429) return "Rate limited by the calendar provider";
    return `Calendar provider returned ${status}`;
}

/** The one place that decides how a feed is talked to. */
export function createProvider(feed: CalendarFeed): CalendarProvider {
    return new IcsFeedProvider(feed);
}

export interface CalendarFetchResult {
    events: CalendarEvent[];
    /** One broken feed must not blank the whole view, so failures come back beside the events. */
    errors: CalendarFeedError[];
}

export async function fetchCalendarEvents(
    providers: CalendarProvider[],
    range: DateRange,
): Promise<CalendarFetchResult> {
    // Hand-rolled rather than Promise.allSettled, which the project's ES2019
    // lib does not declare.
    const settled = await Promise.all(
        providers.map((provider) =>
            provider.fetchEvents(range).then(
                (fetched: CalendarEvent[]) => ({ provider, fetched, reason: null as unknown }),
                (reason: unknown) => ({ provider, fetched: null, reason }),
            ),
        ),
    );

    const events: CalendarEvent[] = [];
    const errors: CalendarFeedError[] = [];

    for (const result of settled) {
        if (result.fetched) {
            events.push(...result.fetched);
            continue;
        }
        errors.push(
            result.reason instanceof CalendarFeedError
                ? result.reason
                : new CalendarFeedError(result.provider.id, String(result.reason)),
        );
    }

    events.sort((a, b) => a.start.getTime() - b.start.getTime());
    return { events, errors };
}

/** Today's local midnight through `days` later, the window a dashboard wants. */
export function rangeForDays(days: number, now: Date = new Date()): DateRange {
    const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const to = new Date(from);
    to.setDate(to.getDate() + days);
    return { from, to };
}

/** Infer the provider from a pasted URL, so the settings tab need not ask. */
export function detectSource(url: string): CalendarSource | null {
    let host: string;
    try {
        host = new URL(url).hostname;
    } catch (e) {
        return null;
    }
    if (host === "calendar.google.com") return "google";
    if (host === "calendar.proton.me") return "proton";
    return null;
}
