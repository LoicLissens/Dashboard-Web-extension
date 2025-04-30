<script lang="ts">
    import youtubeAPI from "../../services/youtubeAPI";
    import {
        setVideosToStorage,
        getVideosFromStorage,
        type Video,
        type Channel,
    } from "../../helpers/manageStorage";
    import { addNotification, NotificationStatus } from "../../store/store";

    export let channel: Channel;

    let videos: Array<Video> = [];
    let hiddenVideosId: Array<string> = channel.hiddenVideos.map((v) => v.id);

    async function fetchLastVideos(uploadPlaylistId: string) {
        const getItemsFromPlaylist =
            await youtubeAPI.getPlaylistItems(uploadPlaylistId);
        for (let i = 0; i <= channel.nbVideoToRetrieve - 1; i++) {
            let video: Video = {
                title: getItemsFromPlaylist.data.items[i].snippet.title,
                thumbnail:
                    getItemsFromPlaylist.data.items[i].snippet.thumbnails.medium
                        .url,
                id: getItemsFromPlaylist.data.items[i].snippet.resourceId
                    .videoId,
            };
            if (!videos.map((e) => e.id).includes(video.id)) {
                videos.push(video);
            }
        }
    }

    async function hideVideo(video: Video) {
        // Can be done with an event as channel are already fetched two components ahead
        // but I don't want to re-render all the component just for this
        if (!hiddenVideosId.includes(video.id)) {
            const channels = await getVideosFromStorage();
            const channelIndex = channels.findIndex(
                (c) => c.channelId === channel.channelId,
            );
            channels[channelIndex].hiddenVideos.push(video);
            await setVideosToStorage(channels);
            hiddenVideosId = channels[channelIndex].hiddenVideos.map(
                (v) => v.id,
            );
            addNotification(
                `The video ${video.title} won't be show again.`,
                NotificationStatus.Success,
            );
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
    {#await fetchLastVideos(channel.uploadPlaylistId)}
        <p>Loading...</p>
    {:then}
        {#each videos as video, i (i)}
            {#if !hiddenVideosId.includes(video.id)}
                <figure class="image is-16by9">
                    <iframe
                        title={video.title}
                        class="has-ratio"
                        src="https://www.youtube.com/embed/{video.id}"
                        frameborder="0"
                        allowfullscreen
                    ></iframe>
                </figure>
                <label class="checkbox">
                    <input type="checkbox" on:change={() => hideVideo(video)} />
                    Hide this video
                </label>
            {/if}
        {/each}
    {/await}
</div>
