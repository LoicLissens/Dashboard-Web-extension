<script>
  import { date } from "../store/store";
  import { greeting, msToDate } from "../helpers/time";
  import { onMount } from "svelte";
  import browser from "webextension-polyfill";
  import { getFromBrowserStorage } from "../helpers/manageStorage";
  let name;
  let nameError;
  function setName(e) {
    const val = e.target.elements.name.value;
    if (!val) {
      nameError = "This fields cannot be empty";
    }
    name = val;
    browser.storage.local.set({ name: val }).catch((err) => {
      console.log(err);
    });
  }
  onMount(() => {
    getFromBrowserStorage("name")
      .then((data) => {
        console.log(data);
        name = data.name;
      })
      .catch((err) => {
        console.error(err);
      });
  });
</script>

<article>
  <p>{msToDate($date)}</p>
  <div />
  {#if !name}
    <form on:submit|preventDefault={setName}>
      <input name="name" type="text" />
      <input type="submit" />
      {#if nameError}
        <p>{nameError}</p>
      {/if}
    </form>
  {:else}
    <div>
      <p>{greeting($date)} {name}</p>
    </div>
  {/if}
</article>
