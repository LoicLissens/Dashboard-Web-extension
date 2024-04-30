<script>
    import { onMount } from "svelte";
    import youtubeAPI from "../../services/youtubeAPI";
    import {
        setTobrowserStorage,
        getFromBrowserStorage,
    } from "../../helpers/manageStorage";
    import { addNotification } from "../../store/store";
    import RegisterCategoryModal  from "./RegisterCategoryModal.svelte";

    let channelId = "";
    let categories = [];
    let categoryChannel = "";
    let isAddingChannel = false;
    let isError = false;

    const fetchChannelInfo = async (InputChannelId, category = "Others") => {
        const getIDs = youtubeAPI.getChannelIDs(InputChannelId);
        const getChannelInfo = youtubeAPI.getChannelInfo(InputChannelId);
        const data = await Promise.all([getIDs, getChannelInfo]).then(
            (resp) => {
                try {
                    const IDs = resp[0].data.items[0];
                    const info = resp[1].data.items[0].snippet;
                    const fullChannelObj = {
                        category: category,
                        channelId: IDs.id,
                        uploadPlaylistId:
                            IDs.contentDetails.relatedPlaylists.uploads,
                        name: info.title,
                        description: info.description,
                        country: info.country,
                        defaultAvatrUrl: info.thumbnails.default.url,
                        mediumAvatrUrl: info.thumbnails.medium.url,
                        highAvatrUrl: info.thumbnails.high.url,
                    };
                    return fullChannelObj;
                } catch (e) {
                    throw new Error("Channel not found");
                }
            },
        );
        return data;
    };
    const storeChannelInfo = async (InputChannelId, category = "Others") => {
        isAddingChannel = true;
        const stockedVideo = await getFromBrowserStorage("video");
        const videos = stockedVideo.video ? [...stockedVideo.video] : [];
        if (videos.some((e) => e.channelId === InputChannelId)) {
            addNotification({
                message: "Channel already stored",
                status: "error",
            });
            isAddingChannel = false;
            isError = true;
            return;
        }
        try {
            const channelToStore = await fetchChannelInfo(
                InputChannelId,
                category,
            );
            const toStore = [...videos, channelToStore];
            await setTobrowserStorage("video", toStore);
            addNotification({
                message: "Channel stored",
                status: "success",
            });
            isAddingChannel = false;
            channelId = "";
            isError = false;
        } catch (e) {
            isAddingChannel = false;
            isError = true;
            addNotification({
                message: "Channel not found",
                status: "error",
            });
        }
    };

    onMount(async () => {
        const tempCategories = await getFromBrowserStorage("categories");
        categories = tempCategories.categories
            ? [...tempCategories.categories]
            : [];
    });
</script>

<div class="is-inline-flex my-3 box">
    {#if categories.length > 0}
        <div class="control {isAddingChannel && 'is-loading'}">
            <input
                bind:value={channelId}
                placeholder="channel ID"
                type="text"
                class="input {isError && 'is-danger'}"
            />
        </div>
        <div class="select px-2">
            <select
                bind:value={categoryChannel}
                name="pets"
                id="category-select"
            >
                <option value="">Chose a category</option>
                {#each categories as category}
                    <option value={category}>{category}</option>
                {/each}
            </select>
        </div>
        <button
            class="button is-primary is-outlined has-text-grey"
            disabled={isAddingChannel || !categoryChannel || !channelId}
            on:click={() => storeChannelInfo(channelId, categoryChannel)}
        >
            <span class="icon">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
            </span>
            <span>Register a channel</span>
        </button>
    {:else}
        <RegisterCategoryModal />
    {/if}
</div>
