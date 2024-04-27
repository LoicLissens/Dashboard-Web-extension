
<script>
    import VideoPlayer from "./VideoPlayer.svelte";
    import Divider from "../utils/Divider.svelte";

    export let channels
    export let category
    let expanded = true
</script>

<div class="is-flex  has-text-grey">
    <span><p class="title is-3  has-text-grey">{category}</p></span>
    <span class="is-clickable is-flex"  on:click={() => expanded = !expanded}>
        {#if !expanded}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="2rem" width="2rem">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
          </svg>
        {:else}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="2rem" width="2rem">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
        {/if}
    </span>
</div>
<div class="divider">
    <Divider />
</div>
  {#if expanded}
    {#each channels as channel}
        <VideoPlayer {channel} />
    {/each}
  {/if}

