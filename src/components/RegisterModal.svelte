<script>
  import { createEventDispatcher } from "svelte";
  import Modal from "./utils/Modal.svelte";
  import Divider from "./utils/Divider.svelte";
  import ConfigFileUploader from "./settings/ConfigFileUploader.svelte";

  export let isModalActive = true;
  let isDanger = false;

  const dispatch = createEventDispatcher();
  function setName(e) {
    e.preventDefault();
    const val = e.target.elements.name.value;
    if (!val) {
      isDanger = true;
      return;
    }
    dispatch("setName", { name: val });
  }
</script>

<Modal {isModalActive}>
  <h1 class="title has-text-grey has-text-centered">Register your name</h1>
  <form
    on:submit|preventDefault={setName}
    class="is-flex is-justify-content-center mb-4"
  >
    <div class="control">
      <input
        name="name"
        type="text"
        placeholder="Name"
        class="input is-narrow {isDanger && 'is-danger'}"
      />
    </div>
    <button class="button is-primary is-outlined has-text-grey ml-2">
      Register Name
    </button>
  </form>
  <Divider />
  <h2 class="title has-text-grey has-text-centered">
    Or configure from a config file
  </h2>
  <div class="is-flex is-justify-content-center">
    <ConfigFileUploader />
  </div>
</Modal>
