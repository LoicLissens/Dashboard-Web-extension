<script>
    import { onMount } from "svelte";
    import youtubeAPI from "../services/youtubeAPI";
    import Divider from "./utils/Divider.svelte";
    export let channel;
    let embededVideo;
    const fetchLastVideo = async (uploadPlaylistId) => {
        const getItemsFromPlaylist = await youtubeAPI.getPlaylistItems(
            uploadPlaylistId
        );
        const lastVideoId =
            getItemsFromPlaylist.data.items[0].snippet.resourceId.videoId;
        const getVideoPlayerInfo = await youtubeAPI.getVideoPlayer(lastVideoId);
        const videoUrl = getVideoPlayerInfo.data.items[0].player.embedHtml;
        embededVideo = videoUrl.replace('src="', 'src="https:');
    };
    onMount(() => {
        fetchLastVideo(channel.uploadPlaylistId);
    });
</script>

<div>
    <div class="is-flex">
        <img class="small-image" src={channel.defaultAvatrUrl} alt="Channel avatar" />
        <p>{channel.name}</p>
    </div>
    <Divider />
    {#if embededVideo}{@html embededVideo}{:else}
        <p>Load video</p>
    {/if}
</div>
<style>
    .small-image {
        width: 50px;  /* Adjust as needed */
        height: 50px; /* Adjust as needed */
    }
</style>