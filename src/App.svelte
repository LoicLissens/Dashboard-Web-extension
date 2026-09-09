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
<!-- pt-16 clears the fixed navbar (min-h-16), which Bulma's
     `has-navbar-fixed-top` body class used to handle. -->
<main class="flex justify-center pt-16">
  <!-- One `toast` container for all notifications so they stack and flow.
       Previously each Notification positioned itself fixed at top:0/right:0,
       so they all piled up at the same coordinates. -->
  <div class="toast toast-top toast-end z-50">
    {#each notificationsList as notification (notification.id)}
      <Notification {notification} />
    {/each}
  </div>
  <Sidebar currentPage={state} on:changePage={(e) => (state = e.detail)} />
  {#if state === Page.HOME}
    <General />
  {:else if state ===  Page.VIDEOS}
    <Videos />
  {/if}
</main>

<style>
  main {
    min-height: 100vh;
    width: 100vw;
  }
</style>
