<script lang="ts">
  import { fade } from 'svelte/transition';
  import youtubeAPI from "../services/youtubeAPI";
  import { getVideosFromStorage,storageKeys,getFromBrowserStorage } from "../helpers/manageStorage";
  import { onMount } from "svelte";
  import VideosConfig from "../components/video/VideosConfig.svelte";
  import CategoryVideos from "../components/video/CategoryVideos.svelte";
  import Tooltip from "../components/utils/Tooltip.svelte";



  let channels = [];
  let categories = [];
  let apiProvided = false;

  onMount(async () => {
    const fetchedChannels = await getVideosFromStorage()
    channels = fetchedChannels ? [...fetchedChannels] : [];
    channels.sort((a, b) => a.category.localeCompare(b.category));
    const fetchedCategories =  await getFromBrowserStorage(storageKeys.CATEGORIES)
    categories = fetchedCategories ? [...fetchedCategories] : [];
    const apiKey = await getFromBrowserStorage(storageKeys.YOUTUBEAPIKEY);
    if(apiKey){
      apiProvided = true;
      youtubeAPI.setAPIKey(apiKey);
    }
  });
</script>

<section  in:fade>
  {#if apiProvided}
  <VideosConfig />
  {#if channels.length > 0}
    {#each categories as category}
      <CategoryVideos channels={channels.filter((c)=>c.category == category)} category={category} />
    {/each}
  {/if}
  {:else}
    <p>API Key not provided
      <Tooltip
            tooltipText="API key can be added in the settings"
            ><span class="icon is-clickable">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    width="0.8rem"
                    height="0.8rem"
                >
                    <path
                        fill-rule="evenodd"
                        d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-6 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7.293 5.293a1 1 0 1 1 .99 1.667c-.459.134-1.033.566-1.033 1.29v.25a.75.75 0 1 0 1.5 0v-.115a2.5 2.5 0 1 0-2.518-4.153.75.75 0 1 0 1.061 1.06Z"
                        clip-rule="evenodd"
                    />
                </svg>
            </span></Tooltip>
    </p>
  {/if}
</section>



