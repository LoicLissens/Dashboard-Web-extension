<script context="module" lang="ts">
    /** Tailwind sizing utilities, matching Bulma's old icon scale
     *  (1rem / 1.5rem / 2rem / 3rem). */
    export enum IconSize {
        Small = "size-4",
        Base = "size-6",
        Medium = "size-8",
        Large = "size-12",
    }
</script>
<script lang="ts">
 export let size: IconSize = IconSize.Base;
 export let scaleOnHover: boolean = false;
 /** Tailwind/daisyUI text-colour utility. SVGs use `currentColor`, so this
  *  is what themes them. */
 export let colorClass: string = "";
</script>
<span
    class="inline-flex items-center justify-center cursor-pointer {size} {colorClass} {scaleOnHover
        ? 'transition-transform hover:scale-105'
        : ''}"
>
    <slot></slot>
</span>