<script>
    import { onMount } from "svelte";
    import youtubeAPI from "../../services/youtubeAPI";
    export let channel;
    let videosIds = [];
    async function fetchLastVideo(uploadPlaylistId) {
        const getItemsFromPlaylist =
            await youtubeAPI.getPlaylistItems(uploadPlaylistId);
        for (let i = 0; i <= channel.nbVideoToRetrieve -1; i++) {
            console.log("pass");
            let videoId =
                getItemsFromPlaylist.data.items[i].snippet.resourceId.videoId;
            videosIds.push(videoId);
        }
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
        {#each videosIds as id}
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
