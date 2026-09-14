<script lang="ts">
    import { onMount } from "svelte";
    import {
        getSyncSettings,
        setSyncSettings,
        getSyncState,
        syncNow,
        type SyncState,
    } from "../../helpers/syncConfig";
    import { type SyncSettings } from "../../services/githubSync";
    import { addNotification, NotificationStatus } from "../../store/store";
    import { msToDate } from "../../helpers/time";
    import Tooltip from "../utils/Tooltip.svelte";
    import QuestionMarkIcon from "../icons/QuestionMarkIcon.svelte";
    import ShowIcon from "../icons/ShowIcon.svelte";
    import HideIcon from "../icons/HideIcon.svelte";
    import { IconSize } from "../icons/BaseIcon.svelte";

    let owner = "";
    let repo = "";
    let path = "dashboard-config.json";
    let branch = "";
    let token = "";
    let hasToken = false;
    let showToken = false;

    let state: SyncState = { lastSyncedSha: null, lastSyncedAt: null };
    let isSyncing = false;

    $: isConfigured = Boolean(owner && repo && path && (token || hasToken));

    onMount(async () => {
        const settings = await getSyncSettings();
        if (settings) {
            owner = settings.owner;
            repo = settings.repo;
            path = settings.path;
            branch = settings.branch || "";
            token = settings.token;
            hasToken = Boolean(settings.token);
        }
        state = await getSyncState();
    });

    async function saveSettings() {
        const settings: SyncSettings = {
            owner: owner.trim(),
            repo: repo.trim(),
            path: path.trim(),
            token: token.trim(),
        };
        if (branch.trim()) settings.branch = branch.trim();
        await setSyncSettings(settings);
        hasToken = Boolean(settings.token);
        addNotification("Sync settings saved", NotificationStatus.Success);
    }

    async function runSync() {
        isSyncing = true;
        try {
            await saveSettings();
            const result = await syncNow();
            state = await getSyncState();
            const detail =
                result.outcome === "up-to-date"
                    ? "Already up to date"
                    : `${result.outcome} (${result.pulledKeys.length} in, ${result.pushedKeys.length} out)`;
            addNotification(detail, NotificationStatus.Success);
            if (result.pulledKeys.length > 0) {
                setTimeout(() => window.location.reload(), 1200);
            }
        } catch (e) {
            addNotification(
                e instanceof Error ? e.message : "Sync failed",
                NotificationStatus.Error,
            );
        } finally {
            isSyncing = false;
        }
    }
</script>

<div>
    <h4 class="text-2xl font-bold text-base-content/60 my-2">
        Config sync
        <Tooltip
            tooltipText="Stores your config in a private GitHub repo so other machines can pull it"
            position="bottom"><QuestionMarkIcon /></Tooltip
        >
    </h4>

    <div class="flex flex-col gap-2 max-w-md">
        <div class="flex gap-2">
            <input
                class="input flex-1"
                type="text"
                placeholder="owner"
                bind:value={owner}
            />
            <input
                class="input flex-1"
                type="text"
                placeholder="repo"
                bind:value={repo}
            />
        </div>
        <div class="flex gap-2">
            <input
                class="input flex-1"
                type="text"
                placeholder="path in repo"
                bind:value={path}
            />
            <input
                class="input w-32"
                type="text"
                placeholder="branch"
                bind:value={branch}
            />
        </div>
        <div class="relative">
            <input
                class="input w-full pr-10"
                type={showToken ? "text" : "password"}
                value={token}
                placeholder="fine-grained token (Contents: read/write)"
                on:input={(e) => (token = e.currentTarget.value)}
            />
            <button
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2"
                aria-label={showToken ? "Hide token" : "Show token"}
                on:click={() => (showToken = !showToken)}
            >
                {#if !showToken}
                    <ShowIcon size={IconSize.Small} />
                {:else}
                    <HideIcon size={IconSize.Small} />
                {/if}
            </button>
        </div>

        <div class="flex gap-2 items-center">
            <button
                class="btn btn-primary btn-outline"
                disabled={!isConfigured || isSyncing}
                on:click={runSync}
            >
                {#if isSyncing}
                    <span class="loading loading-spinner loading-sm"></span>
                {/if}
                Sync now
            </button>
            <button class="btn btn-ghost" disabled={isSyncing} on:click={saveSettings}>
                Save
            </button>
        </div>

        <p class="text-sm text-base-content/60">
            {#if state.lastSyncedAt}
                Last synced {msToDate(state.lastSyncedAt)}
            {:else}
                Never synced from this device
            {/if}
        </p>
        <p class="text-sm text-base-content/40">
            The token and these settings stay on this device and are never part
            of the synced payload. Weather cache is device-local too.
        </p>
    </div>
</div>
