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

    const dispatch = createEventDispatcher();

    export let activeTab: Tab;
</script>

<div class="tabs is-small">
    <ul>
        <li class={activeTab == Tab.General && "is-active"}>
            <a href="#" on:click={() => dispatch("changeTab", "general")}>
                <GeneralIcon  size="" /> General</a
            >
        </li>
        <li class={activeTab == Tab.Videos && "is-active"}>
            <a href="#" on:click={() => dispatch("changeTab", "videos")}
                ><span class="icon">
                   <VideoIcon size="" isFocused={false} />
                </span>Videos</a
            >
        </li>
    </ul>
    <kbd class="key">esc</kbd>
</div>
