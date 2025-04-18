<script lang="ts">
    import { onMount } from "svelte";
    import youtubeAPI from "../../services/youtubeAPI";
    import {
        setVideosToStorage,
        getCategoriesFromStorage,
        getVideosFromStorage,
        type Channel,
        type Categories,
        type Category,
    } from "../../helpers/manageStorage";
    import { addNotification } from "../../store/store";

    import RegisterCategoryModal from "./RegisterCategoryModal.svelte";
    import Tooltip from "../utils/Tooltip.svelte";
    import QuestionMarkIcon from "../icons/QuestionMarkIcon.svelte";

    let channelId = "";
    let categories: Categories = [];
    let categoryChannel = "";
    let isAddingChannel = false;
    let isError = false;
    let isModalActive = false;
    const tooltipText = "Visit the github to know ho to get a channel ID";
    function closeModal() {
        isModalActive = false;
    }
    const fetchChannelInfo = async (
        InputChannelId: string,
        category: Category,
    ) => {
        const getIDs = youtubeAPI.getChannelIDs(InputChannelId);
        const getChannelInfo = youtubeAPI.getChannelInfo(InputChannelId);
        const data = await Promise.all([getIDs, getChannelInfo]).then(
            (resp) => {
                try {
                    const IDs = resp[0].data.items[0];
                    const info = resp[1].data.items[0].snippet;
                    const fullChannelObj: Channel = {
                        category: category,
                        channelId: IDs.id,
                        uploadPlaylistId:
                            IDs.contentDetails.relatedPlaylists.uploads,
                        name: info.title,
                        description: info.description,
                        country: info.country,
                        defaultAvatrUrl: info.thumbnails.default.url,
                        mediumAvatarUrl: info.thumbnails.medium.url,
                        highAvatarUrl: info.thumbnails.high.url,
                        nbVideoToRetrieve: 1,
                        hiddenVideos: [],
                    };
                    return fullChannelObj;
                } catch (e) {
                    throw new Error("Channel not found");
                }
            },
        );
        return data;
    };
    const storeChannelInfo = async (
        InputChannelId: string,
        category: Category,
    ) => {
        isAddingChannel = true;
        const channels = await getVideosFromStorage();
        //TODO: pass stocked video as a props
        if (channels.some((e) => e.channelId === InputChannelId)) {
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
            const toStore = [...channels, channelToStore];
            await setVideosToStorage(toStore);
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
        const tempCategories = await getCategoriesFromStorage();
        categories = tempCategories ? [...tempCategories] : [];
        isModalActive = categories.length === 0;
    });
</script>

<RegisterCategoryModal
    {isModalActive}
    existingCategories={categories}
    on:categoryRegistered={(e) => (
        (categories = [...categories, e.detail]), closeModal()
    )}
    on:closeModal={closeModal}
/>
<div class="my-3 box">
    <h2 class="has-text-centered">
        Enter a channel ID get lasts video from the channel <Tooltip
            {tooltipText}
        >
            <QuestionMarkIcon />
        </Tooltip>
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
        <button
            class="button is-link is-outlined"
            on:click={() => (isModalActive = true)}>Add categories</button
        >
    </div>
</div>
