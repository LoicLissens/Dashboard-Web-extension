<script lang="ts">
    import Divider from "./Divider.svelte";
    export let expanded: boolean = false;
    export let title: string;
    /** Tailwind text-size utility for the title. */
    export let titleSize = "text-3xl";
</script>

<div class="flex items-center gap-2 text-base-content/60 mt-1">
    <span><p class="{titleSize} font-bold">{title}</p></span>
    <button
        type="button"
        class="flex cursor-pointer"
        aria-expanded={expanded}
        aria-label={expanded ? "Collapse" : "Expand"}
        on:click={() => (expanded = !expanded)}
    >
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
    </button>
</div>
<Divider />
{#if expanded}
    <slot />
{/if}
