<script lang="ts">
    import { onMount } from "svelte";
    import { removeNotification } from "../store/store";

    export let notification;
    const colorStatusMapper = {
        success: "is-success",
        error: "is-danger",
        warning: "is-warning",
        info: "is-info",
    };
    $: colorByStatus = colorStatusMapper[notification.status];

    onMount(() => {
        setTimeout(() => {
            removeNotification(notification.id);
        }, 3000);
    });
</script>

<div class="notification {colorByStatus} is-light is-flex">
    {notification.message}
    <button on:click={() => removeNotification(notification.id)} class="ml-2">
        <span class="icon">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                />
            </svg>
        </span>
    </button>
</div>

<style scoped>
    div {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 9999;
    }
</style>
