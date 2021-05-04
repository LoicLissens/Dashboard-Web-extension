<script>
  import { createEventDispatcher } from "svelte";
  export let pages;
  const dispatch = createEventDispatcher();
</script>

<aside>
  <nav>
    <ul>
      {#each pages as page}
        <li on:click={() => dispatch("changePage", page.state)}>{page.label}</li>
      {/each}
    </ul>
  </nav>
</aside>

<style>
  aside {
    position: fixed;
    top: 40%;
    left: 0%;
  }
  li {
    cursor: pointer;
    list-style: none;
    padding-left: 0;
  }
</style>
