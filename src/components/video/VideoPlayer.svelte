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
        const items = getItemsFromPlaylist.data.items ?? [];
        for (let i = 0; i <= channel.nbVideoToRetrieve - 1; i++) {
            const item = items[i];
            if (!item) break;
            let video: Video = {
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.medium.url,
                id: item.snippet.resourceId.videoId,
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

<div class="card bg-base-100 shadow-md mb-4">
    <div class="card-body gap-2">
        <div class="flex items-center gap-2">
            <figure class="size-12 shrink-0">
                <img
                    class="rounded-full"
                    src={channel.defaultAvatrUrl}
                    alt="Channel avatar"
                />
            </figure>
            <p class="underline font-semibold text-primary">
                {channel.name}
            </p>
        </div>
        {#await fetchLastVideos(channel.uploadPlaylistId)}
            <span class="loading loading-spinner"></span>
        {:then}
            {#each videos as video, i (i)}
                {#if !hiddenVideosId.includes(video.id)}
                    <iframe
                        title={video.title}
                        class="aspect-video w-full rounded"
                        src="https://www.youtube.com/embed/{video.id}"
                        frameborder="0"
                        allowfullscreen
                    ></iframe>
                    <label class="label cursor-pointer justify-start gap-2">
                        <input
                            type="checkbox"
                            class="checkbox checkbox-sm"
                            on:change={() => hideVideo(video)}
                        />
                        <span>Hide this video</span>
                    </label>
                {/if}
            {/each}
        {/await}
    </div>
</div>
