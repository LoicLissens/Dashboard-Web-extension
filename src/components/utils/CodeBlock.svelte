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

<pre class="bg-base-300 text-base-content rounded p-2 overflow-x-auto"><code
        bind:this={ref}
        class="language-json font-mono whitespace-pre">{code}</code></pre>

<style>
    /* highlight.js injects these spans at runtime, so Svelte's scoping would
       strip the rules -- hence :global(). */
    :global(.hljs-string) {
        color: #2aa198;
    }

    :global(.hljs-number) {
        color: #d33682;
    }

    :global(.hljs-attr) {
        color: #b58900;
    }
</style>
