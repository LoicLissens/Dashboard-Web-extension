<script lang="ts">
    import { onMount } from "svelte";
    import { removeNotification,type Notification,  NotificationStatus} from "../store/store";

    export let notification: Notification;

    const colorStatusMapper = {
        [NotificationStatus.Success]: "alert-success",
        [NotificationStatus.Error]: "alert-error",
        [NotificationStatus.Warning]: "alert-warning",
        [NotificationStatus.Info]: "alert-info",
    };
    $: colorByStatus = colorStatusMapper[notification.status]

    onMount(() => {
        setTimeout(() => {
            removeNotification(notification.id);
        }, 3000);
    });
</script>

<!-- Positioning lives in the `toast` container in App.svelte. -->
<div class="alert {colorByStatus} alert-soft">
    <span>{notification.message}</span>
    <button
        class="btn btn-sm btn-circle btn-ghost"
        aria-label="Dismiss notification"
        on:click={() => removeNotification(notification.id)}
    >
        ✕
    </button>
</div>
