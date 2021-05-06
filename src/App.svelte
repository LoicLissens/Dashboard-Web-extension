<script>
  import browser from "webextension-polyfill";
  import General from "./views/General.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import Videos from "./views/Videos.svelte";
  const pages = [
    { label: "General", state: "general" },
    { label: "Dev's Ressources", state: "devsressources" },
    { label: "Articles", state: "articles" },
    { label: "Videos", state: "videos" },
  ];
  let state = "videos";
</script>

<main>
  <Sidebar {pages} on:changePage={(e) => (state = e.detail)} />
  {#if state === "general"}
    <General />
  {:else if state === "devsressources"}
    <p>issou</p>
  {:else if state === "articles"}
    <p>issou2</p>
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
