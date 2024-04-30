<script>
    import { onMount } from 'svelte';
    import {removeNotification} from '../store/store'

    export let notification
    const colorStatusMapper = {
        success: 'is-success',
        error: 'is-danger',
        warning: 'is-warning',
        info: 'is-info'
    }
    $: colorByStatus =  colorStatusMapper[notification.status]

    onMount(() => {
    setTimeout(() => {
        removeNotification(notification.id)
    }, 5000);
  });
</script>

<div class="notification {colorByStatus} is-light">
    <button class="delete" on:click={() =>removeNotification(notification.id)}></button>
    {notification.message}
</div>
<style scoped>
    div{
       position: fixed;
        top: 0;
        right: 0;
        z-index: 9999;
    }
</style>