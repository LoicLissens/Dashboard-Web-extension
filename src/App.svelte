<script>
  import browser from "webextension-polyfill";
  import General from "./views/General.svelte";
</script>

<main>
  <General />
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
</style>
