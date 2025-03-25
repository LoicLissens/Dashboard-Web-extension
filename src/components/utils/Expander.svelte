<script lang="ts">
    import Divider from "./Divider.svelte";
    export let expanded: boolean = false;
    export let title: string;
</script>

<div class="is-flex has-text-grey">
    <span><p class="title is-3 has-text-grey">{title}</p></span>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span class="is-clickable is-flex" on:click={() => (expanded = !expanded)}>
        {#if expanded}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                height="2rem"
                width="2rem"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m4.5 15.75 7.5-7.5 7.5 7.5"
                />
            </svg>
        {:else}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                height="2rem"
                width="2rem"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
            </svg>
        {/if}
    </span>
</div>
<Divider />
{#if expanded}
    <slot />
{/if}
