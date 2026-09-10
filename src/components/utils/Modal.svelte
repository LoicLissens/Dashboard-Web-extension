<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let isModalActive: boolean;
    /** When false, Escape and backdrop clicks do not close the modal. Used for
     *  blocking modals the user must complete (e.g. registering a name). */
    export let dismissible: boolean = true;

    let dialog: HTMLDialogElement;

    const dispatch = createEventDispatcher<{ closeModal: never }>();

    // `dialog` is only assigned once the element is mounted, so this also
    // covers the case of the component mounting with isModalActive already true.
    $: if (dialog) {
        if (isModalActive && !dialog.open) {
            dialog.showModal();
        } else if (!isModalActive && dialog.open) {
            dialog.close();
        }
    }
</script>

<!-- A native <dialog> gives Escape-to-close, backdrop click (via the
     `modal-backdrop` form) and focus trapping for free, which is why this
     component no longer needs a keydown listener or a click-outside action. -->
<dialog
    bind:this={dialog}
    class="modal"
    on:close={() => dispatch("closeModal")}
    on:cancel={(e) => {
        if (!dismissible) e.preventDefault();
    }}
>
    <div class="modal-box">
        <slot></slot>
    </div>
    {#if dismissible}
        <form method="dialog" class="modal-backdrop blur">
            <button>close</button>
        </form>
    {/if}
</dialog>
