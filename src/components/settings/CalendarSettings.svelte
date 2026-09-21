<script lang="ts">
    import { onMount } from "svelte";
    import {
        getCalendarConfigFromStorage,
        setCalendarConfigToStorage,
        DEFAULT_CALENDAR_CONFIG,
        type CalendarConfig,
    } from "../../helpers/manageStorage";
    import {
        createProvider,
        detectSource,
        rangeForDays,
        type CalendarFeed,
        type FileCalendarFeed,
        type UrlCalendarFeed,
    } from "../../services/calendarAPI";
    import { addNotification, NotificationStatus } from "../../store/store";
    import { daysAgo } from "../../helpers/time";
    import Tooltip from "../utils/Tooltip.svelte";
    import QuestionMarkIcon from "../icons/QuestionMarkIcon.svelte";
    import ShowIcon from "../icons/ShowIcon.svelte";
    import HideIcon from "../icons/HideIcon.svelte";
    import { IconSize } from "../icons/BaseIcon.svelte";

    const GOOGLE_ID = "google";
    const PROTON_ID = "proton";

    let googleUrl = "";
    let showUrl = false;
    let proton: FileCalendarFeed | null = null;
    let daysAhead = DEFAULT_CALENDAR_CONFIG.daysAhead;
    let isImporting = false;

    onMount(async () => {
        const config = await getCalendarConfigFromStorage();
        daysAhead = config.daysAhead;
        const google = config.feeds.find((f) => f.id === GOOGLE_ID);
        if (google && google.kind === "url") googleUrl = google.url;
        const stored = config.feeds.find((f) => f.id === PROTON_ID);
        if (stored && stored.kind === "file") proton = stored;
    });

    function buildConfig(): CalendarConfig {
        const feeds: CalendarFeed[] = [];
        const url = googleUrl.trim();
        if (url) {
            const feed: UrlCalendarFeed = {
                kind: "url",
                id: GOOGLE_ID,
                label: "Google",
                source: "google",
                url,
            };
            feeds.push(feed);
        }
        if (proton) feeds.push(proton);
        return { feeds, daysAhead };
    }

    async function save() {
        const url = googleUrl.trim();
        if (url && detectSource(url) !== "google") {
            addNotification(
                "That does not look like a calendar.google.com iCal address",
                NotificationStatus.Error,
            );
            return;
        }
        await setCalendarConfigToStorage(buildConfig());
        addNotification("Calendar settings saved", NotificationStatus.Success);
    }

    async function onFilePicked(event: Event) {
        const input = event.currentTarget as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        isImporting = true;
        try {
            const ics = await file.text();
            const candidate: FileCalendarFeed = {
                kind: "file",
                id: PROTON_ID,
                label: "Proton",
                source: "proton",
                ics,
                importedAt: Date.now(),
            };
            // Parse before storing: a wrong file should fail here, with a count
            // to confirm it worked, rather than silently render an empty agenda.
            const events = await createProvider(candidate).fetchEvents(
                rangeForDays(daysAhead),
            );
            proton = candidate;
            await setCalendarConfigToStorage(buildConfig());
            addNotification(
                `Imported ${file.name}: ${events.length} events in the next ${daysAhead} days`,
                NotificationStatus.Success,
            );
        } catch (e) {
            addNotification(
                e instanceof Error ? e.message : "Could not read that file",
                NotificationStatus.Error,
            );
        } finally {
            isImporting = false;
            input.value = "";
        }
    }

    async function removeProton() {
        proton = null;
        await setCalendarConfigToStorage(buildConfig());
        addNotification("Proton calendar removed", NotificationStatus.Success);
    }
</script>

<div>
    <h4 class="text-2xl font-bold text-base-content/60 my-2">
        Calendars
        <Tooltip
            tooltipText="Reads iCalendar feeds directly -- no account connection, no backend"
            position="bottom"><QuestionMarkIcon /></Tooltip
        >
    </h4>

    <div class="flex flex-col gap-4 max-w-md">
        <div>
            <p class="font-semibold mb-1">Google</p>
            <p class="text-sm text-base-content/60 mb-2">
                Calendar settings -&gt; your calendar -&gt; Integrate calendar
                -&gt; <em>Secret address in iCal format</em>.
            </p>
            <div class="relative">
                <input
                    class="input w-full pr-10"
                    type={showUrl ? "text" : "password"}
                    value={googleUrl}
                    placeholder="https://calendar.google.com/calendar/ical/..."
                    on:input={(e) => (googleUrl = e.currentTarget.value)}
                />
                <button
                    type="button"
                    class="absolute right-2 top-1/2 -translate-y-1/2"
                    aria-label={showUrl ? "Hide address" : "Show address"}
                    on:click={() => (showUrl = !showUrl)}
                >
                    {#if !showUrl}
                        <ShowIcon size={IconSize.Small} />
                    {:else}
                        <HideIcon size={IconSize.Small} />
                    {/if}
                </button>
            </div>
        </div>

        <div>
            <p class="font-semibold mb-1">Proton</p>
            <p class="text-sm text-base-content/60 mb-2">
                Sharing a Proton calendar by link needs a paid plan, so this
                takes the exported file instead: Proton Calendar -&gt; Settings
                -&gt; Calendars -&gt; Export. It is a snapshot, not a live feed
                -- re-import it to refresh.
            </p>
            <input
                class="file-input file-input-sm w-full"
                type="file"
                accept=".ics,text/calendar"
                disabled={isImporting}
                on:change={onFilePicked}
            />
            {#if proton}
                <div class="flex items-center gap-2 mt-2">
                    <span class="text-sm text-base-content/60">
                        Imported {daysAgo(proton.importedAt)}
                    </span>
                    <button class="btn btn-ghost btn-xs" on:click={removeProton}>
                        Remove
                    </button>
                </div>
            {/if}
        </div>

        <label class="flex items-center gap-2">
            <span class="text-sm">Show the next</span>
            <input
                class="input input-sm w-20"
                type="number"
                min="1"
                max="365"
                bind:value={daysAhead}
            />
            <span class="text-sm">days</span>
        </label>

        <div>
            <button class="btn btn-primary btn-outline" on:click={save}>Save</button>
        </div>

        <p class="text-sm text-base-content/40">
            The Google address is a credential -- anyone holding it can read that
            calendar. It and the imported Proton file stay on this device: both
            are excluded from config sync and from the downloadable config.
        </p>
    </div>
</div>
