<script lang="ts">
  export let tooltipText = '';
  export let position: 'top' | 'bottom' | 'left' | 'right' = 'top';
</script>

<span class="tooltip tooltip-{position}" data-tip={tooltipText}>
  <slot></slot>
</span>
