<script lang="ts">
  import { date } from "../store/store";
  import { greeting, msToDate } from "../helpers/time";
  import { onMount } from "svelte";
  import { getFromBrowserStorage,setTobrowserStorage,StorageKeys } from "../helpers/manageStorage";
  import RegisterModal from "./RegisterModal.svelte";

  let name = "";

  function setName(registeredName: string) {
      setTobrowserStorage(StorageKeys.NAME, registeredName)
      .then(() => {
        name = registeredName;
      })
      .catch((err) => {
        console.log(err);
    });
  }
  onMount(() => {
    getFromBrowserStorage(StorageKeys.NAME)
      .then((data) => {
        name = typeof data === "string" ? data : "";
      })
      .catch((err) => {
        console.error(err);
      });
  });
</script>

<RegisterModal isModalActive={!name} on:setName={e => setName(e.detail.name)} />
<div class="flex items-center gap-2">
  <p class="text-sm text-base-content/60">{msToDate($date)}</p>
  {#if name}
    <p class="font-semibold">{greeting($date)} {name}</p>
  {/if}
</div>
