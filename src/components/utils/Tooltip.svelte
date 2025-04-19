<script lang="ts">
  export let tooltipText = '';
  export let position: 'top' | 'bottom' | 'left' | 'right' = 'top';
</script>

<span class="tooltip" data-tooltip={tooltipText} data-position={position}>
  <slot></slot>
</span>

<style>
  .tooltip {
    position: relative;
    display: inline-block;
  }

  .tooltip::after {
    content: attr(data-tooltip);
    position: absolute;
    background: #333;
    border-radius: 4px;
    color: #fff;
    padding: 5px;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
    white-space: nowrap;
    z-index: 1;
  }

  .tooltip[data-position="top"]::after,
  .tooltip:not([data-position])::after {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 5px;
  }
  .tooltip[data-position="bottom"]::after {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 5px;
  }
  .tooltip[data-position="left"]::after {
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-right: 5px;
  }
  .tooltip[data-position="right"]::after {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 5px;
  }

  /* ARROWS */
  .tooltip::before {
    content: '';
    position: absolute;
    opacity: 0;
    transition: opacity 0.3s;
    border: 5px solid transparent;
    z-index: 1;
  }

  .tooltip[data-position="top"]::before,
  .tooltip:not([data-position])::before {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-top-color: #333;
    margin-bottom: -5px;
  }
  .tooltip[data-position="bottom"]::before {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-bottom-color: #333;
    margin-top: -5px;
  }
  .tooltip[data-position="left"]::before {
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-left-color: #333;
    margin-right: -5px;
  }
  .tooltip[data-position="right"]::before {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-right-color: #333;
    margin-left: -5px;
  }
  .tooltip:hover::after,
  .tooltip:hover::before {
    opacity: 1;
  }
</style>