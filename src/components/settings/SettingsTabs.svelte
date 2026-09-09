<script context="module" lang="ts">
    import GeneralIcon from "../icons/GeneralIcon.svelte";
    import VideoIcon from "../icons/VideoIcon.svelte";
    import { IconSize } from "../icons/BaseIcon.svelte";

    export enum Tab {
        General = "general",
        Videos = "videos",
    }
</script>

<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher<{ changeTab: Tab }>();

    export let activeTab: Tab;
</script>

<div class="tabs is-small">
    <ul>
        <li class={activeTab === Tab.General ? "is-active" : ""}>
            <button type="button" on:click={() => dispatch("changeTab", Tab.General)}>
                <GeneralIcon size={IconSize.Base} /> General
            </button>
        </li>
        <li class={activeTab === Tab.Videos ? "is-active" : ""}>
            <button type="button" on:click={() => dispatch("changeTab", Tab.Videos)}>
                <span class="icon">
                    <VideoIcon size={IconSize.Base} isFocused={false} />
                </span>Videos
            </button>
        </li>
    </ul>
    <kbd class="key">esc</kbd>
</div>
