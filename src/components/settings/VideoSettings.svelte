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

    async function setApiKey(e:SubmitEvent) {
        const apiKey = e.target.elements.key.value;
        await setTobrowserStorage(StorageKeys.YOUTUBEAPIKEY, apiKey);
        youtubeAPI.setAPIKey(apiKey);
        ytApiKey = apiKey;
        isDisabled = true;
        showKey = false;
    }

    async function setNBVideoToRetrieve(e, channelId:string) {
        const nbVideo = e.target!.value;
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
    <h4 class="title is-4 has-text-grey my-2">
        Youtube API Key
    </h4>
    {#if ytApiKey}
        <form on:submit|preventDefault={(e) => setApiKey(e)}>
            <div class="is-flex">
                <div>
                    <div class="control has-icons-right">
                        <input
                            class="input"
                            type={showKey ? "text" : "password"}
                            value={ytApiKey}
                            disabled={isDisabled}
                            name="key"
                        />
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <span
                            class="icon is-right is-clickable"
                            on:click={() => (showKey = !showKey)}
                        >
                            {#if !showKey}
                                <ShowIcon size={IconSize.Small}/>
                            {:else}
                                <HideIcon size={IconSize.Small}/>
                            {/if}
                        </span>
                    </div>
                </div>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <span
                    class="icon is-align-self-center"
                    on:click={editApiKey}
                >
                    <EditIcon isFocused={!isDisabled} size={IconSize.Medium}/>
                </span>
            </div>
        </form>
    {:else}
        <form on:submit|preventDefault={(e) => setApiKey(e)}>
            <div class="field">
                <div class="control">
                    <input
                        class="input"
                        name="key"
                        type="text"
                        placeholder="Add a Youtube API key"
                    />
                </div>
            </div>
        </form>
    {/if}
    <!--Catergory part-->
    <div>
        <h4 class="title is-4 has-text-grey my-2">
            Categories
        </h4>
        <div>
            {#if categories}
                <div class="tags">
                    {#each categories as category}
                        <!--TODO Add delete action and try to retregger component if something change in the settings-->
                        <span class="tag mr-1"
                            >{category}<button class="delete is-small"
                            ></button></span
                        >
                    {/each}
                </div>
            {/if}
        </div>
    </div>
    <div>
        <h4 class="title is-4 title has-text-grey my-2">
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
                                <button class="delete" on:click={deleteChannel(channel.channelId)}></button>
                            </div>
                            <div>
                                Number of video to retrieve : <input
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
                                        {video.title} <button class="delete" on:click={()=>deleteHiddenVideo(video.id,channel.channelId)}></button>
                                {/each}
                            </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>
