<script>
    import {removeNotification} from '../store/store'

    export let notification
    const colorStatusMapper = {
        success: 'is-success',
        error: 'is-danger',
        warning: 'is-warning',
        info: 'is-info'
    }
    $: colorByStatus =  colorStatusMapper[notification.status]
</script>

<div class="notification {colorByStatus}">
    <p>{notification.message}</p>
    <button class="delete" on:click={() =>removeNotification(notification.id)}></button>s
</div>

<style scoped>
    div{
       position: fixed;
        top: 0;
        right: 0;
    }
</style>