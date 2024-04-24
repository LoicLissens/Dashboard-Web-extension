<script>
  import General from "./views/Home.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import Videos from "./views/Videos.svelte";
  const pages = [
    { label: "Home", state: "home" },
    { label: "Videos", state: "videos" },
  ];
  let state = "home";
</script>

<main>
  <Sidebar {pages} on:changePage={(e) => (state = e.detail)} />
  {#if state === "home"}
    <General />
  {:else if state === "videos"}
    <Videos />
  {/if}
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    flex-direction: row;
  }
</style>
