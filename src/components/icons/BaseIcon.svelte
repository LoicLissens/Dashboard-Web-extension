<script context="module" lang="ts">
    export enum IconSize {
        Small = "is-small",
        Base =  "",
        Medium = "is-medium",
        Large = "is-large",
    }
</script>
<script lang="ts">
 export let size: IconSize = IconSize.Base;
 export let scaleOnHover: boolean = false;
 $:hoverClass = scaleOnHover ? 'hover' : '';
</script>
<span class={`icon ${size || ''} ${hoverClass} is-clickable`}>
    <slot></slot>
</span>
<style scoped>
    .hover:hover{
        scale: 1.04;
    }
</style>