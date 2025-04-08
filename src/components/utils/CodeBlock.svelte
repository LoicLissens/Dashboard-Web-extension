<script lang="ts">
    import hljs from 'highlight.js/lib/core';
    import json from 'highlight.js/lib/languages/json';
    import { onMount } from 'svelte';

    export let code:string
    let ref:HTMLElement;

    onMount(() => {
        hljs.registerLanguage('json', json);
        hljs.highlightElement(ref);
    });
</script>
<pre>
    <code bind:this={ref} >{code}</code>
  </pre>