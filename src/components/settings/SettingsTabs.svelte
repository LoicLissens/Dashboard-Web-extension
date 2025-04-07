<script context="module" lang="ts">
    import GeneralIcon from "../icons/GeneralIcon.svelte";
    import VideoIcon from "../icons/VideoIcon.svelte";

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
                <GeneralIcon /> General</a
            >
        </li>
        <li class={activeTab == Tab.Videos && "is-active"}>
            <a href="#" on:click={() => dispatch("changeTab", "videos")}
                ><span class="icon">
                   <VideoIcon />
                </span>Videos</a
            >
        </li>
    </ul>
    <kbd class="key">esc</kbd>
</div>
