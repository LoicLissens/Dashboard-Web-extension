<script>
  import { notifications } from './store/store';

  import General from "./views/Home.svelte";
  import Sidebar from "./components/layout/Sidebar.svelte";
  import Videos from "./views/Videos.svelte";
  import Notification from './components/Notification.svelte';
  import Navbar from './components/layout/Navbar.svelte';

  let notificationsList = [];
  notifications.subscribe(value => {
    notificationsList = value;
  });

  const pages = [
    { label: "Home", state: "home" },
    { label: "Videos", state: "videos" },
  ];
  let state = "videos";
</script>

<Navbar />
<main class="is-flex is-justify-content-center">
  {#each notificationsList as notification (notification.id)}
    <Notification {notification} />
  {/each}
  <Sidebar {pages} on:changePage={(e) => (state = e.detail)} />
  {#if state === "home"}
    <General  />
  {:else if state === "videos"}
    <Videos />
  {/if}
</main>

<style>
  main {
    height: 100vh; /* 100% of the viewport height */
    width: 100vw; /* 80% of the viewport width */
  }
</style>
