<script lang="ts">
    import hljs from "highlight.js/lib/core";
    import json from "highlight.js/lib/languages/json";
    import { onMount } from "svelte";

    export let code: string;
    let ref: HTMLElement;

    onMount(() => {
        hljs.registerLanguage("json", json);
        hljs.highlightElement(ref);
    });
</script>

<pre>
    <code bind:this={ref} class="language-json">{code}</code>
</pre>

<style>
    :global(.hljs-string) {
        color: #2aa198;;
    }

    :global(.hljs-number) {
        color: #d33682;
    }

    :global(.hljs-attr) {
        color: #b58900;
    }
    pre {
        background-color:  #282c34;
        border-radius: 4px;
        padding: 0px;
    }
    code {
        font-family: monospace;
        overflow: auto;
    }
</style>
