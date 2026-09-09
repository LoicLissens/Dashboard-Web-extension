<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Modal from "./utils/Modal.svelte";
  import Divider from "./utils/Divider.svelte";
  import ConfigFileUploader from "./settings/ConfigFileUploader.svelte";

  export let isModalActive: boolean = true;
  let isDanger = false;

  const dispatch = createEventDispatcher<{ setName: { name: string } }>();
  function setName(e: Event & { currentTarget: HTMLFormElement }) {
    e.preventDefault();
    const val = (
      e.currentTarget.elements.namedItem("name") as HTMLInputElement
    ).value;
    if (!val) {
      isDanger = true;
      return;
    }
    dispatch("setName", { name: val });
  }
</script>

<Modal {isModalActive} dismissible={false}>
  <h1 class="text-2xl font-bold text-center text-base-content/60">Register your name</h1>
  <form
    on:submit|preventDefault={setName}
    class="flex justify-center items-center gap-2 mb-4"
  >
    <div>
      <input
        name="name"
        type="text"
        placeholder="Name"
        class="input input-bordered {isDanger ? 'input-error' : ''}"
      />
    </div>
    <button class="btn btn-primary btn-outline">
      Register Name
    </button>
  </form>
  <Divider />
  <h2 class="text-xl font-bold text-center text-base-content/60">
    Or configure from a config file
  </h2>
  <div class="flex justify-center">
    <ConfigFileUploader />
  </div>
</Modal>
