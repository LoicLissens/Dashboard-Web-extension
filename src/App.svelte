<script lang="ts">
  import { notifications, type Notification as NotificationType } from "./store/store";
  import {Page} from "./helpers/manageStorage";

  import General from "./views/Home.svelte";
  import Sidebar from "./components/layout/Sidebar.svelte";
  import Videos from "./views/Videos.svelte";
  import Notification from "./components/Notification.svelte";
  import Navbar from "./components/layout/Navbar.svelte";

  let notificationsList: Array<NotificationType> = [];
  notifications.subscribe((value) => {
    notificationsList = value;
  });
  let state = Page.VIDEOS;

</script>

<Navbar />
<main class="is-flex is-justify-content-center">
  {#each notificationsList as notification (notification.id)}
    <Notification {notification} />
  {/each}
  <Sidebar currentPage={state} on:changePage={(e) => (state = e.detail)} />
  {#if state === Page.HOME}
    <General />
  {:else if state ===  Page.VIDEOS}
    <Videos />
  {/if}
</main>

<style>
  main {
    height: 100vh;
    width: 100vw;
  }
</style>
