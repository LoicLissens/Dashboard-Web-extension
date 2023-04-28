<script>
  import VideosConfig from "../components/VideosConfig.svelte";
  import VideoPlayer from "../components/VideoPlayer.svelte";

  import { getFromBrowserStorage } from "../helpers/manageStorage";
  import { onMount } from "svelte";

  let channels = [];

  onMount(async () => {
    const fetchedChannels = await getFromBrowserStorage("video");
    channels = fetchedChannels.video ? [...fetchedChannels.video] : [];
  });
</script>

<section>
  <VideosConfig />

  {#if channels.length > 0}
    <p>All your vieo</p>
    {#each channels as channel}
      <VideoPlayer {channel} />
    {/each}
  {:else}
    <p>Loading</p>
  {/if}
</section>
