<script>
    import { onMount } from "svelte";
    import  {getFromBrowserStorage, setTobrowserStorage,storageKeys} from "../../helpers/manageStorage"
    import youtubeAPI from "../../services/youtubeAPI";

    let ytApiKey;

    onMount(() => {
        getFromBrowserStorage(storageKeys.YOUTUBEAPIKEY).then((data) => {
            ytApiKey = data;
        })
    });
    async function setApiKey(e) {
        const apiKey = e.target.elements.key.value;
        await setTobrowserStorage(storageKeys.YOUTUBEAPIKEY, apiKey);
        youtubeAPI.setAPIKey(apiKey);
        ytApiKey = apiKey;
    }

</script>
<div>
    {#if ytApiKey}
    <div class="field">
        <label class="label">Youtube API Key</label>
        <div class="control">
            <input class="input" type="text" value={ytApiKey} disabled />
        </div>
    </div>
    {:else}
        <form on:submit|preventDefault={(e)=>setApiKey(e)}>
            <div class="field">
                <label class="label">Youtube API Key</label>
                <div class="control">
                    <input class="input" name="key" type="text" placeholder="Add a Youtube API key" />
                </div>
            </div>
        </form>
    {/if}
</div>