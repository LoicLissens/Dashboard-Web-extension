<script lang="ts">
    import { onMount } from "svelte";
    import {
        getFromBrowserStorage,
        setTobrowserStorage,
        StorageKeys,
        getCategoriesFromStorage,
        getVideosFromStorage,
        type Categories,
        type Channels
    } from "../../helpers/manageStorage";
    import youtubeAPI from "../../services/youtubeAPI";
    import ShowIcon from "../icons/ShowIcon.svelte";
    import HideIcon from "../icons/HideIcon.svelte";
    import EditIcon from "../icons/EditIcon.svelte";
    import {IconSize} from "../icons/BaseIcon.svelte";
    import Divider from "../utils/Divider.svelte";

    let ytApiKey: string;
    let categories: Categories;
    let channels:Channels;
    let showKey = false;
    let isDisabled = true;

    onMount(() => {
        Promise.all([
            getFromBrowserStorage(StorageKeys.YOUTUBEAPIKEY).then((data) => {
                ytApiKey = data as string;
            }),
            getCategoriesFromStorage().then((data) => {
                categories = data;
            }),
            getVideosFromStorage().then((data) => {
                channels = data;
            }),
        ]);
    });

    async function setApiKey(e: Event & { currentTarget: HTMLFormElement }) {
        const apiKey = (
            e.currentTarget.elements.namedItem("key") as HTMLInputElement
        ).value;
        await setTobrowserStorage(StorageKeys.YOUTUBEAPIKEY, apiKey);
        youtubeAPI.setAPIKey(apiKey);
        ytApiKey = apiKey;
        isDisabled = true;
        showKey = false;
    }

    async function setNBVideoToRetrieve(
        e: Event & { currentTarget: HTMLInputElement },
        channelId: string,
    ) {
        const nbVideo = Number(e.currentTarget.value);
        const index = channels.findIndex(
            (channel) => channel.channelId === channelId,
        );
        channels[index].nbVideoToRetrieve = nbVideo;
        await setTobrowserStorage(StorageKeys.VIDEO, channels);
    }
    async function deleteChannel(channelId:string) {
        const index = channels.findIndex(
            (channel) => channel.channelId === channelId
        );
        channels.splice(index, 1)
        channels = channels
        await setTobrowserStorage(StorageKeys.VIDEO, channels);
    }
    async function deleteHiddenVideo(videoId:string, channelId:string) {
        const index = channels.findIndex(
            (channel) => channel.channelId === channelId
        );
        const hiddenVideos = channels[index].hiddenVideos;
        const videoIndex = hiddenVideos.findIndex(
            (video) => video.id === videoId
        );
        hiddenVideos.splice(videoIndex, 1);
        channels[index].hiddenVideos = hiddenVideos;
        await setTobrowserStorage(StorageKeys.VIDEO, channels);
    }
    const editApiKey = () => {
        isDisabled = !isDisabled;
        showKey = isDisabled ? false : true;
    };
</script>

<div>
    <!-- TODO Refactor if/else, It suck this way I think AND MAKE A COMPONENT-->
    <h4 class="text-2xl font-bold text-base-content/60 my-2">
        Youtube API Key
    </h4>
    {#if ytApiKey}
        <form on:submit|preventDefault={(e) => setApiKey(e)}>
            <div class="flex items-center gap-2">
                <div>
                    <div class="relative inline-block">
                        <input
                            class="input pr-10"
                            type={showKey ? "text" : "password"}
                            value={ytApiKey}
                            disabled={isDisabled}
                            name="key"
                        />
                        <button
                            type="button"
                            class="absolute right-2 top-1/2 -translate-y-1/2"
                            aria-label={showKey ? "Hide API key" : "Show API key"}
                            on:click={() => (showKey = !showKey)}
                        >
                            {#if !showKey}
                                <ShowIcon size={IconSize.Small}/>
                            {:else}
                                <HideIcon size={IconSize.Small}/>
                            {/if}
                        </button>
                    </div>
                </div>
                <button
                    type="button"
                    class="self-center"
                    aria-label="Edit API key"
                    on:click={editApiKey}
                >
                    <EditIcon isFocused={!isDisabled} size={IconSize.Medium}/>
                </button>
            </div>
        </form>
    {:else}
        <form on:submit|preventDefault={(e) => setApiKey(e)}>
            <input
                class="input w-full max-w-xs"
                name="key"
                type="text"
                placeholder="Add a Youtube API key"
            />
        </form>
    {/if}
    <!--Catergory part-->
    <div>
        <h4 class="text-2xl font-bold text-base-content/60 my-2">
            Categories
        </h4>
        <div>
            {#if categories}
                <div class="flex flex-wrap gap-1">
                    {#each categories as category}
                        <!--TODO Add delete action and try to retregger component if something change in the settings-->
                        <span class="badge gap-1"
                            >{category}<button
                                class="btn btn-xs btn-circle btn-ghost"
                                aria-label={`Delete category ${category}`}
                            >✕</button></span
                        >
                    {/each}
                </div>
            {/if}
        </div>
    </div>
    <div>
        <h4 class="text-2xl font-bold text-base-content/60 my-2">
            Channels
        </h4>
        <div>
            {#if channels}
                <div>
                    {#each channels as channel,i}
                            {#if i != 0}
                                <Divider/>
                            {/if}
                            <div>
                                Name : {channel.name}
                                <button
                                    class="btn btn-xs btn-circle btn-ghost"
                                    aria-label={`Delete channel ${channel.name}`}
                                    on:click={() => deleteChannel(channel.channelId)}
                                >✕</button>
                            </div>
                            <div>
                                Number of video to retrieve : <input
                                    class="input input-sm w-20"
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={channel.nbVideoToRetrieve}
                                    on:change={(e) =>
                                        setNBVideoToRetrieve(
                                            e,
                                            channel.channelId,
                                        )}
                                />
                            </div>
                            <div class="mb-2">
                                Hidden videos :
                                {#each channel.hiddenVideos as video}
                                        {video.title} <button
                                            class="btn btn-xs btn-circle btn-ghost"
                                            aria-label={`Unhide ${video.title}`}
                                            on:click={()=>deleteHiddenVideo(video.id,channel.channelId)}
                                        >✕</button>
                                {/each}
                            </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>
