<script>
  import youtubeAPI from "../services/youtubeAPI";
  import { setTobrowserStorage, getFromBrowserStorage } from "../helpers/manageStorage";
  import { onMount } from "svelte";
  let video;
  let channelId;
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

  onMount(() => {
    getFromBrowserStorage("video")
      .then((data) => {
        video = data.video.uploadPlaylistId;
      })
      .then(() => {
        console.log(video);
        youtubeAPI.getPlaylistItems(video).then((resp) => {
          console.log(resp);
        });
      });
  });
</script>

<section>
  {@html '\u003ciframe width="480" height="270" src="https://www.youtube.com/embed/BKQVqzhnP8I" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen\u003e\u003c/iframe\u003e'}
  <div>
    <input bind:value={channelId} type="text" />
    <button on:click={storeChannelInfo}>Fetch</button>
    <p>{JSON.stringify(video)}</p>
  </div>
</section>
