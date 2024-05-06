<script>
    import { onMount } from "svelte";
    import  {getFromBrowserStorage} from "../../helpers/manageStorage"

    let ytApiKey;

    onMount(() => {
        ytApiKey = getFromBrowserStorage("ytApiKey").then((data) => {
            ytApiKey = data;
        })
    });

</script>
<div class="">
    {#if ytApiKey}
    <div class="field">
        <label class="label">Youtube API Key</label>
        <div class="control">
            <input class="input" type="text" placeholder="Text input" value={ytApiKey} />
        </div>
    </div>
    {:else}
        <div class="field">
            <label class="label">Youtube API Key</label>
            <div class="control">
                <input class="input" type="text" placeholder="Text input" />
            </div>
        </div>
    {/if}

</div>