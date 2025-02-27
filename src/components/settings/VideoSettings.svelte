<script>
    import { onMount } from "svelte";
    import {
        getFromBrowserStorage,
        setTobrowserStorage,
        storageKeys,
    } from "../../helpers/manageStorage";
    import youtubeAPI from "../../services/youtubeAPI";

    let ytApiKey;
    let showKey = false;
    let isDisabled = true;

    onMount(() => {
        getFromBrowserStorage(storageKeys.YOUTUBEAPIKEY).then((data) => {
            ytApiKey = data;
        });
    });
    async function setApiKey(e) {
        const apiKey = e.target.elements.key.value;
        await setTobrowserStorage(storageKeys.YOUTUBEAPIKEY, apiKey);
        youtubeAPI.setAPIKey(apiKey);
        ytApiKey = apiKey;
        isDisabled = true;
        showKey = false;
    }
    const editApiKey = () => {
        isDisabled = !isDisabled;
        showKey = isDisabled ? false : true
    };
</script>

<div>  <!-- TODO Refactor if/else, It suck this way I think AND MAKE A COMPONENT-->
    <h4 class="title is-4 title has-text-grey has-text-centere">Youtube API Key</h4>
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
                    <span
                        class="icon is-small is-right is-clickable"
                        on:click={() => (showKey = !showKey)}
                    >
                        {#if !showKey}
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
                                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                            </svg>
                        {:else}
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
                                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                />
                            </svg>
                        {/if}
                    </span>
                </div>
            </div>
            <span class="icon is-align-self-center is-clickable" on:click={editApiKey}>
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
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                </svg>
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
    <div class=""></div>
</div>
