<script>
    export let tooltipText = '';
  </script>

  <span class="tooltip" data-tooltip="{tooltipText}">
    <slot></slot>
  </span>
  <style>
    .tooltip {
      position: relative;
    }
    .tooltip::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: #333;
      border-radius: 4px;
      color: #fff;
      padding: 5px;
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
      white-space: nowrap;
    }
    .tooltip:hover::after {
      opacity: 1;
    }
  </style>