<script>
    import { onMount } from "svelte";
    import youtubeAPI from "../services/youtubeAPI";
    import {
        setTobrowserStorage,
        getFromBrowserStorage,
    } from "../helpers/manageStorage";

    let channelId = "";
    let categoryToRegister = "";
    let categories = [];
    let channelNotFound = false;
    let channelAlreadyStored = false;

    const fetchChannelInfo = async (channelId, category = "Others") => {
        const getIDs = youtubeAPI.getChannelIDs(channelId);
        const getChannelInfo = youtubeAPI.getChannelInfo(channelId);
        const data = await Promise.all([getIDs, getChannelInfo]).then(
            (resp) => {
                try{
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
                }
                catch(e){
                    throw new Error("Channel not found");
                }
            }
        );
        return data;
    };
    const storeChannelInfo = async (channelId, category = "Others") => {
        const stockedVideo = await getFromBrowserStorage("video");
        const videos = stockedVideo.video ? [...stockedVideo.video] : [];
        if (videos.some((e) => e.channelId === channelId)){
            channelAlreadyStored = true;
            return;
        }
        try{
            const channelToStore = await fetchChannelInfo(channelId, category);
            const toStore = [...videos, channelToStore];
            await setTobrowserStorage("video", toStore);
        }
        catch(e){
            channelNotFound = true;
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

<div class="bg-red">
    {#if categories.length > 0}
        <div class="is-flex">
            <div>
                <input bind:value={channelId} placeholder="channel ID" type="text" class="input" />
            </div>
            <div class="select">
                <select
                bind:value={categoryToRegister}
                name="pets"
                id="category-select"
            >
                <option value="">Chose a category</option>
                {#each categories as category}
                    <option value={category}>{category}</option>
                {/each}
            </select>
            </div>
        </div>
    {:else}
        No categories registered
        <div>
            <input
                bind:value={categoryToRegister}
                placeholder="Category"
                type="text"
            />
            <button  on:click={() => storeCatergory(categoryToRegister)}
                >Register Category</button
            >
        </div>
    {/if}
    <button class="button" disabled={!categoryToRegister || !channelId} on:click={() => storeChannelInfo(channelId, categoryToRegister)}>Register a video
    </button >
    {#if channelNotFound}
        <p>Channel could not be retrieved</p>
    {/if}
    {#if channelAlreadyStored}
        <p>Channel already stored</p>
    {/if}
</div>
