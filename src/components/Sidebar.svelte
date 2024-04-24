<script>
  import { createEventDispatcher } from "svelte";
  import browser from "webextension-polyfill";
  export let pages;
  const dispatch = createEventDispatcher();
</script>

<aside>
  <nav>
    <ul>
      {#each pages as page}
      <li>
        <button class="button" on:click={() => dispatch("changePage", page.state)}>
          {page.label}
        </button>
      </li>
      {/each}
      <span><h1>Debug part</h1></span>
      <li>
        <button
          class="button"
          on:click={async () => window.alert(JSON.stringify(await browser.storage.local.get()))}
          >Log all</button
        >
      </li>
      <li>
        <button class="button" on:click={async () => await browser.storage.local.clear()}
          >clear</button
        >
      </li>
    </ul>
  </nav>
</aside>

<style>
  aside {
    position: fixed;
    top: 40%;
    left: 0%;
    display: block;
  }
  li {
    cursor: pointer;
    list-style: none;
    padding-left: 0;
  }
</style>
