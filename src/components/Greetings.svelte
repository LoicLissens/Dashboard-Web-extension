<script>
  import { date } from "../store/store";
  import { greeting, msToDate } from "../helpers/time";
  import { onMount } from "svelte";
  import browser from "webextension-polyfill";
  import { getFromBrowserStorage } from "../helpers/manageStorage";
  import RegisterModal from "./RegisterModal.svelte";
  let name;
  function remNAme(){ //TODO: Implement this function
    browser.storage.local.set({ name: null }).catch((err) => {
        console.log(err);
    });
    name = null;
  }
  function setName(name) {
      browser.storage.local.set({ name: name }).catch((err) => {
        name = name;
        console.log(err);
    });
    console.log(name);
  }
  onMount(() => {
    getFromBrowserStorage("name")
      .then((data) => {
        name = data.name;
      })
      .catch((err) => {
        console.error(err);
      });
  });
</script>

<RegisterModal isModalActive={!name} on:setName={e => setName(e.detail.name)} />
<div class="navbar-item">
  <p class="mx-2">{msToDate($date)}</p>
  {#if name}
    <div>
      <p>{greeting($date)} {name}</p>
    </div>
  {/if}
  </div>
