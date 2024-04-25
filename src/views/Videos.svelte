<script>
  import { fade } from 'svelte/transition';
  import VideosConfig from "../components/VideosConfig.svelte";
  import CategoryVideos from "../components/CategoryVideos.svelte";

  import { getFromBrowserStorage } from "../helpers/manageStorage";
  import { onMount } from "svelte";

  let channels = [];
  let categories = [];

  onMount(async () => {
    const fetchedChannels = await getFromBrowserStorage("video");
    console.log(fetchedChannels);
    channels = fetchedChannels.video ? [...fetchedChannels.video] : [];
    channels.sort((a, b) => a.category.localeCompare(b.category));
    const fetchedCategories =  await getFromBrowserStorage("categories")
    categories = fetchedCategories.categories ? [...fetchedCategories.categories] : [];
    console.log(categories);
  });
</script>

<section in:fade>
  <VideosConfig />
  {#if channels.length > 0}
    {#each categories as category}
      <CategoryVideos channels={channels.filter((c)=>c.category == category)} category={category} />
    {/each}
  {:else}
    <p>Loading</p>
  {/if}
</section>
