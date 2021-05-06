<script>
  import youtubeAPI from "../services/youtubeAPI";
  import { setTobrowserStorage, getFromBrowserStorage } from "../helpers/manageStorage";
  import { onMount } from "svelte";
  let video;
  let channelId;
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
  const storeChannelInfo = async () => {
    let channelToStore = await fetchChannelInfo(channelId);
    setTobrowserStorage("video", channelToStore);
  };
  const fetchLastVideo = () => {
    return;
  };
  onMount(async () => {
    const getPlayListId = await getFromBrowserStorage("video");
    video = getPlayListId.video.uploadPlaylistId;
    const getItemsFromPlaylist = await youtubeAPI.getPlaylistItems(video);
    const lastVideoId = getItemsFromPlaylist.data.items[0].snippet.resourceId.videoId;
    const getVideoPlayerInfo = await youtubeAPI.getVideoPlayer(lastVideoId);
    const videoUrl = getVideoPlayerInfo.data.items[0].player.embedHtml;
    vid = videoUrl.replace('src="', 'src="https:');
  });
</script>

<section>lol</section>
