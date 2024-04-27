<script>
    import { onMount } from "svelte";
    import youtubeAPI from "../../services/youtubeAPI";
    import {
        setTobrowserStorage,
        getFromBrowserStorage,
    } from "../../helpers/manageStorage";
    import { addNotification } from "../../store/store";

    let channelId = "";
    let categoryToRegister = "";
    let categories = [];

    const fetchChannelInfo = async (channelId, category = "Others") => {
        const getIDs = youtubeAPI.getChannelIDs(channelId);
        const getChannelInfo = youtubeAPI.getChannelInfo(channelId);
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
    const storeChannelInfo = async (channelId, category = "Others") => {
        const stockedVideo = await getFromBrowserStorage("video");
        const videos = stockedVideo.video ? [...stockedVideo.video] : [];
        if (videos.some((e) => e.channelId === channelId)) {
            addNotification({
                message: "Channel already stored",
                status: "error",
            });
            return;
        }
        try {
            const channelToStore = await fetchChannelInfo(channelId, category);
            const toStore = [...videos, channelToStore];
            await setTobrowserStorage("video", toStore);
        } catch (e) {
            addNotification({
                message: "Channel not found",
                status: "error",
            });
        }
    };
    const storeCatergory = async (category) => {
        const stockedCatergories = await getFromBrowserStorage("categories");
        const tempCategories = stockedCatergories.categories
            ? [...stockedCatergories.categories]
            : [];
        await setTobrowserStorage("categories", [...tempCategories, category]);
        categories = [...tempCategories, category];
        categoryToRegister = "";
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
        <div>
            <input
                bind:value={channelId}
                placeholder="channel ID"
                type="text"
                class="input"
            />
        </div>
        <div class="select px-2">
            <select
                bind:value={categoryToRegister}
                name="pets"
                id="category-select"
            >
                <option>Chose a category</option>
                {#each categories as category}
                    <option value={category}>{category}</option>
                {/each}
            </select>
        </div>
    {:else}
        <p>No categories registered</p>
        <div>
            <input
                bind:value={categoryToRegister}
                placeholder="Category"
                type="text"
            />
            <button on:click={() => storeCatergory(categoryToRegister)}>Register Category</button>
        </div>
    {/if}
    <button
        class="button is-primary is-outlined has-text-grey"
        disabled={!categoryToRegister || !channelId}
        on:click={() => storeChannelInfo(channelId, categoryToRegister)}
        >
        <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
        </span>
        <span>Register a channel</span>
    </button>
</div>

