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
    import { addNotification, NotificationStatus } from "../../store/store";

    import RegisterCategoryModal from "./RegisterCategoryModal.svelte";
    import Tooltip from "../utils/Tooltip.svelte";
    import QuestionMarkIcon from "../icons/QuestionMarkIcon.svelte";

    let channelURL = "";
    let categories: Categories = [];
    let categoryChannel = "";
    let isAddingChannel = false;
    let isError = false;
    let isModalActive = false;
    const tooltipText = "Eg: https://www.youtube.com/@grafikart";
    function closeModal() {
        isModalActive = false;
    }
    const storeChannelInfo = async (
        InputChannelURL: string,
        category: Category,
    ): Promise<void> => {
        isAddingChannel = true;
        try {
            const channelID =
                await youtubeAPI.getChannelIDfromURL(InputChannelURL);
            const channels = await getVideosFromStorage();
            //TODO: pass stocked video as a props
            if (channels.some((e) => e.channelId === channelID)) {
                addNotification({
                    message: "Channel already stored",
                    status: NotificationStatus.Error,
                });
                isAddingChannel = false;
                isError = true;
                return;
            }
            const channelToStore = await youtubeAPI.fetchChannelInfo(
                channelID,
                category,
            );
            const toStore = [...channels, channelToStore];
            await setVideosToStorage(toStore);
            addNotification({
                message: "Channel stored",
                status: NotificationStatus.Success,
            });
            isAddingChannel = false;
            channelURL = "";
            isError = false;
        } catch (e) {
            isAddingChannel = false;
            isError = true;
            addNotification({
                message: "Channel not found",
                status: NotificationStatus.Error,
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
        Enter an URL channel to get lasts videos.<Tooltip {tooltipText}>
            <QuestionMarkIcon />
        </Tooltip>
    </h2>
    <div class="is-inline-flex">
        <div class="control {isAddingChannel && 'is-loading'}">
            <input
                bind:value={channelURL}
                placeholder="Channel URL"
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
            disabled={isAddingChannel || !categoryChannel || !channelURL}
            on:click={() => storeChannelInfo(channelURL, categoryChannel)}
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
