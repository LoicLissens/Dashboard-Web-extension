<script lang="ts">
    import { onMount } from "svelte";
    import { getCalendarConfigFromStorage } from "../helpers/manageStorage";
    import {
        createProvider,
        fetchCalendarEvents,
        rangeForDays,
        IcsTextProvider,
        type CalendarEvent,
        type CalendarProvider,
    } from "../services/calendarAPI";
    import { daysAgo, dayKey } from "../helpers/time";

    interface Day {
        key: string;
        date: Date;
        events: CalendarEvent[];
    }

    let isLoading = true;
    let days: Day[] = [];
    let errors: string[] = [];
    /** Feeds that are frozen snapshots, so the agenda can admit how old it is. */
    let snapshots: { label: string; importedAt: number }[] = [];
    let hasFeeds = false;

    const timeFormat = new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    });
    const dayFormat = new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    function groupByDay(events: CalendarEvent[]): Day[] {
        const byDay = new Map<string, Day>();
        for (const event of events) {
            const key = dayKey(event.start);
            let day = byDay.get(key);
            if (!day) {
                day = { key, date: event.start, events: [] };
                byDay.set(key, day);
            }
            day.events.push(event);
        }
        return [...byDay.values()];
    }

    async function load() {
        isLoading = true;
        try {
            const config = await getCalendarConfigFromStorage();
            hasFeeds = config.feeds.length > 0;
            if (!hasFeeds) {
                days = [];
                return;
            }

            const providers: CalendarProvider[] = config.feeds.map(createProvider);
            snapshots = providers
                .filter((p): p is IcsTextProvider => p instanceof IcsTextProvider)
                .map((p) => ({ label: p.label, importedAt: p.importedAt }));

            const result = await fetchCalendarEvents(
                providers,
                rangeForDays(config.daysAhead),
            );
            days = groupByDay(result.events);
            errors = result.errors.map((e) => e.message);
        } finally {
            isLoading = false;
        }
    }

    onMount(load);
</script>

<div>
    {#if isLoading}
        <span class="loading loading-spinner loading-sm"></span>
    {:else if !hasFeeds}
        <p class="text-base-content/60">
            No calendar configured yet -- add one from the gear icon.
        </p>
    {:else}
        {#each errors as error}
            <div class="alert alert-warning alert-soft mb-2">
                <span>{error}</span>
            </div>
        {/each}

        {#if days.length === 0}
            <p class="text-base-content/60">Nothing scheduled.</p>
        {:else}
            <div class="flex flex-col gap-4">
                {#each days as day (day.key)}
                    <div>
                        <p
                            class="text-sm font-semibold text-base-content/50 border-b border-base-300 pb-1 mb-2"
                        >
                            {dayFormat.format(day.date)}
                        </p>
                        <ul class="flex flex-col gap-1">
                            {#each day.events as event (event.id)}
                                <li class="flex gap-3 items-baseline">
                                    <span
                                        class="text-sm tabular-nums text-base-content/60 w-24 shrink-0"
                                    >
                                        {event.allDay
                                            ? "all day"
                                            : `${timeFormat.format(event.start)} - ${timeFormat.format(event.end)}`}
                                    </span>
                                    <span class="flex-1">
                                        {event.title}
                                        {#if event.location}
                                            <span class="text-base-content/40 text-sm">
                                                @ {event.location}
                                            </span>
                                        {/if}
                                    </span>
                                    <span
                                        class="badge badge-sm badge-ghost shrink-0"
                                        class:badge-primary={event.source === "google"}
                                    >
                                        {event.source}
                                    </span>
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/each}
            </div>
        {/if}

        {#each snapshots as snapshot}
            <p class="text-xs text-base-content/40 mt-3">
                {snapshot.label} is an imported snapshot from {daysAgo(
                    snapshot.importedAt,
                )} -- re-import to refresh.
            </p>
        {/each}
    {/if}
</div>
