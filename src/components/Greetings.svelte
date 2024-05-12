<script>
  import { date } from "../store/store";
  import { greeting, msToDate } from "../helpers/time";
  import { onMount } from "svelte";
  import { getFromBrowserStorage,setTobrowserStorage,storageKeys } from "../helpers/manageStorage";
  import RegisterModal from "./RegisterModal.svelte";

  let name;

  function setName(registeredName) {
      setTobrowserStorage(storageKeys.NAME, registeredName)
      .then(() => {
        name = registeredName;
      })
      .catch((err) => {
        console.log(err);
    });
  }
  onMount(() => {
    getFromBrowserStorage(storageKeys.NAME)
      .then((data) => {
        name = data;
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
