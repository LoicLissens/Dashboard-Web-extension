<script context="module" lang="ts">
    export enum IconSize {
        Small = "is-small",
        Medium = "is-medium",
        Large = "is-large",
    }
</script>
<script lang="ts">
 export let size: IconSize;
</script>
<span class={`icon ${size || ''}`}>
    <slot></slot>
</span>