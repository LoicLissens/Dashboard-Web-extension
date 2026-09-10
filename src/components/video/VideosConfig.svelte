<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import youtubeAPI from "../../services/youtubeAPI";
    import {
        setVideosToStorage,
        type Categories,
        type Category,
        type Channels
    } from "../../helpers/manageStorage";
    import { addNotification, NotificationStatus } from "../../store/store";

    import RegisterCategoryModal from "./RegisterCategoryModal.svelte";
    import Tooltip from "../utils/Tooltip.svelte";
    import QuestionMarkIcon from "../icons/QuestionMarkIcon.svelte";

    export let channels:Channels = [];
    export let categories: Categories = [];

    let channelURL = "";
    let categoryChannel = "";
    let isAddingChannel = false;
    let isError = false;
    let isModalActive = categories.length === 0;

    const dispatch = createEventDispatcher<{ channelRegistered: Channels }>();
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
            const newChannelID =
                await youtubeAPI.getChannelIDfromURL(InputChannelURL);
            if (channels.some((e) => e.channelId === newChannelID)) {
                addNotification("Channel already registered",NotificationStatus.Error);
                isAddingChannel = false;
                isError = true;
                return;
            }
            const newChannel = await youtubeAPI.fetchChannelInfo(
                newChannelID,
                category,
            );
            const toStore = [...channels, newChannel];
            await setVideosToStorage(toStore);
            addNotification("Channel registered",NotificationStatus.Success);
            isAddingChannel = false;
            channelURL = "";
            isError = false;
            dispatch("channelRegistered", toStore);
        } catch (e) {
            isAddingChannel = false;
            isError = true;
            addNotification("Channel not found",NotificationStatus.Error);
        }
    };

</script>

<RegisterCategoryModal
    {isModalActive}
    existingCategories={categories}
    on:categoryRegistered={(e) => (
        (categories = [...categories, e.detail]), closeModal()
    )}
    on:categoryDeleted={(e) => {
        categories = categories.filter((c) => c !== e.detail);
    }}
    on:closeModal={closeModal}
/>
<div class="my-3 card bg-base-100 shadow-md"><div class="card-body">
    <h2 class="text-center">
        Enter an URL channel to get lasts videos.<Tooltip {tooltipText}>
            <QuestionMarkIcon />
        </Tooltip>
    </h2>
    <div class="flex flex-wrap items-center gap-2">
        <div class="flex items-center gap-2">
            <input
                bind:value={channelURL}
                placeholder="Channel URL"
                type="text"
                class="input input-bordered {isError ? 'input-error' : ''}"
            />
            {#if isAddingChannel}
                <span class="loading loading-spinner loading-sm"></span>
            {/if}
        </div>
        <select
                class="select select-bordered"
                bind:value={categoryChannel}
                name="pets"
                id="category-select"
            >
                <option value="">Chose a category</option>
                {#each categories as category}
                    <option value={category}>{category}</option>
                {/each}
            </select>
        <button
            class="btn btn-primary btn-outline"
            disabled={isAddingChannel || !categoryChannel || !channelURL}
            on:click={() => storeChannelInfo(channelURL, categoryChannel)}
        >
            <span class="inline-flex items-center justify-center size-5">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
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
    <div class="text-center mt-2">
        <button
            class="btn btn-link btn-outline"
            on:click={() => (isModalActive = true)}>Add categories</button
        >
    </div>
</div>
</div>
