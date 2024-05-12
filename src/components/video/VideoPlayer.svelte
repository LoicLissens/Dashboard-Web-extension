<script>
    import { onMount } from "svelte";
    import youtubeAPI from "../../services/youtubeAPI";
    export let channel;
    let lastVideoId;
    const fetchLastVideo = async (uploadPlaylistId) => {
        const getItemsFromPlaylist =
            await youtubeAPI.getPlaylistItems(uploadPlaylistId);
        lastVideoId =
            getItemsFromPlaylist.data.items[0].snippet.resourceId.videoId;
    };
    onMount(() => {
        fetchLastVideo(channel.uploadPlaylistId);
    });
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
    <figure class="image is-16by9">
        <iframe
            class="has-ratio"
            src="https://www.youtube.com/embed/{lastVideoId}"
            frameborder="0"
            allowfullscreen
        ></iframe>
    </figure>
</div>


