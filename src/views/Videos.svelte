<script>
  import youtubeAPI from "../services/youtubeAPI";
  import {
    setTobrowserStorage,
    getFromBrowserStorage,
  } from "../helpers/manageStorage";
  import { onMount } from "svelte";
  import browser from "webextension-polyfill";
  let video;
  let vid;
  const fetchChannelInfo = async (id) => {
    const getIDs = youtubeAPI.getChannelIDs(id);
    const getChannelInfo = youtubeAPI.getChannelInfo(id);
    const data = await Promise.all([getIDs, getChannelInfo]).then((resp) => {
      const IDs = resp[0].data.items[0];
      const info = resp[1].data.items[0].snippet;
      const fullChannelObj = {
        channelId: IDs.id,
        uploadPlaylistId: IDs.contentDetails.relatedPlaylists.uploads,
        name: info.title,
        description: info.description,
        country: info.country,
        defaultAvatrUrl: info.thumbnails.default.url,
        mediumAvatrUrl: info.thumbnails.medium.url,
        highAvatrUrl: info.thumbnails.high.url,
      };
      return fullChannelObj;
    });
    return data;
  };
  const storeChannelInfo = async (channelId) => {
    let channelToStore = await fetchChannelInfo(channelId);
    setTobrowserStorage("video", channelToStore);
  };
  const fetchLastVideo = () => {
    return;
  };
  const testSotrage = async () => {
    const storage = await browser.storage.local.get();
  };
  onMount(async () => {
    const getPlayListId = await getFromBrowserStorage("video");
    console.log(getPlayListId);
    video = getPlayListId.video.uploadPlaylistId;
    const getItemsFromPlaylist = await youtubeAPI.getPlaylistItems(video);
    const lastVideoId =
      getItemsFromPlaylist.data.items[0].snippet.resourceId.videoId;
    const getVideoPlayerInfo = await youtubeAPI.getVideoPlayer(lastVideoId);
    const videoUrl = getVideoPlayerInfo.data.items[0].player.embedHtml;
    vid = videoUrl.replace('src="', 'src="https:');
  });
  // JVC channel id UCprWC5gZXAZ6M5V--ZtmTvw
</script>

<section>
  <button on:click={testSotrage}>Register a video</button>
  {#if video}
    <p>All your vieo</p>
    {@html vid}
  {:else}
    <p>
      No videos available, please register a channel id to fetches last videos.
    </p>
  {/if}
</section>
