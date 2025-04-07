<script lang="ts">
    export let isModalActive: boolean;

</script>
<div class="modal {isModalActive && 'is-active'}">
    <div class="modal-background blur"></div>
    <div class="modal-content box">
        <slot></slot>
    </div>
  </div>