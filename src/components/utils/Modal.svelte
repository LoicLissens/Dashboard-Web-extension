<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { createEventDispatcher } from "svelte";
    import {clickOutside} from "../../helpers/clickOutside.js";

    export let isModalActive: boolean;

    let keydownHandler:(evt: KeyboardEvent) => void;

    const dispatch = createEventDispatcher();

    function closeModal() {
        dispatch("closeModal")
    }
    onMount(() => {
        keydownHandler = function (event) {
            if (event.key === "Escape") {
                closeModal()
            }
        };

        window.addEventListener("keydown", keydownHandler);
    });
    onDestroy(() => {
        window.removeEventListener("keydown", keydownHandler);
    });
</script>
<div class="modal {isModalActive && 'is-active'}">
    <div class="modal-background blur"></div>
    <div class="modal-content box"  use:clickOutside on:click_outside={closeModal}>
        <slot></slot>
    </div>
  </div>