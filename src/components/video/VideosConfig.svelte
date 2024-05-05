<script>
    import { onMount } from "svelte";
    import youtubeAPI from "../../services/youtubeAPI";
    import {
        setTobrowserStorage,
        getFromBrowserStorage,
    } from "../../helpers/manageStorage";
    import { addNotification } from "../../store/store";
    import RegisterCategoryModal from "./RegisterCategoryModal.svelte";
    import Tooltip from "../utils/Tooltip.svelte";

    let channelId = "";
    let categories = [];
    let categoryChannel = "";
    let isAddingChannel = false;
    let isError = false;
    let isModalActive = false;

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
        isModalActive = categories.length === 0;
    });
</script>

<RegisterCategoryModal
    {isModalActive}
    on:categoryRegistered={(e) => (
        (categories = [...categories, e.detail]), (isModalActive = false)
    )}
/>
<div class="my-3 box">
    <h2 class="has-text-centered">
        Enter a channel ID get lasts video from the channel <Tooltip
            tooltipText="The channel ID can be obtained in the settings"
            ><span class="icon is-clickable">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    width="0.8rem"
                    height="0.8rem"
                >
                    <path
                        fill-rule="evenodd"
                        d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-6 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7.293 5.293a1 1 0 1 1 .99 1.667c-.459.134-1.033.566-1.033 1.29v.25a.75.75 0 1 0 1.5 0v-.115a2.5 2.5 0 1 0-2.518-4.153.75.75 0 1 0 1.061 1.06Z"
                        clip-rule="evenodd"
                    />
                </svg>
            </span></Tooltip
        >
    </h2>
    <div class="is-inline-flex">
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
    </div>
    <div class="has-text-centered mt-2">
        <a href="#" on:click={() => (isModalActive = true)}>Add categories</a>
    </div>
</div>
