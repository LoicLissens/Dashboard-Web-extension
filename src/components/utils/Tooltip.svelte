<script lang="ts">
  export let tooltipText = '';
  export let position: 'top' | 'bottom' | 'left' | 'right' = 'top';

  // Tailwind scans source as plain text, so an interpolated `tooltip-{position}`
  // is never generated. The class names have to appear literally.
  const POSITION_CLASS = {
    top: 'tooltip-top',
    bottom: 'tooltip-bottom',
    left: 'tooltip-left',
    right: 'tooltip-right',
  } as const;

  $: positionClass = POSITION_CLASS[position];
</script>

<span class="tooltip {positionClass}" data-tip={tooltipText}>
  <slot></slot>
</span>
