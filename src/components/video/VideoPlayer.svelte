<script>
    import { onMount } from "svelte";
    import youtubeAPI from "../../services/youtubeAPI";
    export let channel;
    let lastVideoId;
    let videosID = [];
    async function fetchLastVideo(uploadPlaylistId) {
        const getItemsFromPlaylist =
            await youtubeAPI.getPlaylistItems(uploadPlaylistId);
        lastVideoId =
            getItemsFromPlaylist.data.items[0].snippet.resourceId.videoId;
        videosID.push(lastVideoId);
    }
</script>

<div class="box channelbox block">
    <div class="is-flex mb-2">
        <figure class="image is-48x48">
            <img
                class="is-rounded"
                src={channel.defaultAvatrUrl}
                alt="Channel avatar"
            />
        </figure>
        <p
            class="is-flex is-align-items-center ml-2 is-underlined has-text-weight-semibold has-text-primary-dark"
        >
            {channel.name}
        </p>
    </div>
    {#await fetchLastVideo(channel.uploadPlaylistId)}
        <p>Loading...</p>
    {:then}
        {#each videosID as id}
            <figure class="image is-16by9">
                <iframe
                    class="has-ratio"
                    src="https://www.youtube.com/embed/{id}"
                    frameborder="0"
                    allowfullscreen
                ></iframe>
            </figure>
        {/each}
    {/await}
</div>
