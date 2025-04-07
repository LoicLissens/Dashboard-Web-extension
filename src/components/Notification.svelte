<script lang="ts">
    import { onMount } from "svelte";
    import { removeNotification,type Notification,  NotificationStatus} from "../store/store";

    export let notification: Notification;

    const colorStatusMapper = {
        [NotificationStatus.Success]: "is-success",
        [NotificationStatus.Error]: "is-danger",
        [NotificationStatus.Warning]: "is-warning",
        [NotificationStatus.Info]: "is-info",
    };
    $: colorByStatus = colorStatusMapper[notification.status]

    onMount(() => {
        setTimeout(() => {
            removeNotification(notification.id);
        }, 3000);
    });
</script>

<div class="notification {colorByStatus} is-light is-flex">
    {notification.message}
    <button on:click={() => removeNotification(notification.id)} class="ml-2">
        <span class="delete is-medium">
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
