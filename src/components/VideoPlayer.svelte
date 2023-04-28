<script>
    import { onMount } from "svelte";
    import youtubeAPI from "../services/youtubeAPI";
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
    <h2>{channel.name}</h2>
    <p>Category: {channel.category}</p>
    <img src={channel.defaultAvatrUrl} alt="Channel avatar" />
    {#if embededVideo}{@html embededVideo}{:else}
        <p>Load video</p>
    {/if}
</div>
