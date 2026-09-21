<script context="module" lang="ts">
    import GeneralIcon from "../icons/GeneralIcon.svelte";
    import VideoIcon from "../icons/VideoIcon.svelte";
    import CalendarIcon from "../icons/CalendarIcon.svelte";
    import { IconSize } from "../icons/BaseIcon.svelte";

    export enum Tab {
        General = "general",
        Videos = "videos",
        Calendar = "calendar",
    }
</script>

<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher<{ changeTab: Tab }>();

    export let activeTab: Tab;
</script>

<!-- daisyUI tabs are flat: the ul/li wrapper Bulma required is gone. -->
<div class="flex items-center justify-between">
    <div role="tablist" class="tabs tabs-border tabs-sm">
        <button
            role="tab"
            type="button"
            class="tab gap-1"
            class:tab-active={activeTab === Tab.General}
            on:click={() => dispatch("changeTab", Tab.General)}
        >
            <GeneralIcon size={IconSize.Small} /> General
        </button>
        <button
            role="tab"
            type="button"
            class="tab gap-1"
            class:tab-active={activeTab === Tab.Videos}
            on:click={() => dispatch("changeTab", Tab.Videos)}
        >
            <VideoIcon size={IconSize.Small} isFocused={false} /> Videos
        </button>
        <button
            role="tab"
            type="button"
            class="tab gap-1"
            class:tab-active={activeTab === Tab.Calendar}
            on:click={() => dispatch("changeTab", Tab.Calendar)}
        >
            <CalendarIcon size={IconSize.Small} /> Calendar
        </button>
    </div>
    <kbd class="kbd kbd-sm">esc</kbd>
</div>
