<script>
    import { createEventDispatcher } from 'svelte';

    export let isModalActive = true;
    let isDanger = false;

    const dispatch = createEventDispatcher();
    function setName (e) {
      e.preventDefault();
      const val = e.target.elements.name.value;
      if (!val) {
        isDanger = true;
        return
      }
      dispatch('setName', { name: val });
    }
  </script>


  <div class="modal {isModalActive && 'is-active'}">
    <div class="modal-background blur"></div>
    <div class="modal-content">
      <div class="box">
        <h1 class="title has-text-grey has-text-centered">Register your name</h1>
        <form on:submit|preventDefault={setName} class="is-flex is-justify-content-center">
          <div class="control">
            <input name="name" type="text"  placeholder="Name" class="input is-narrow {isDanger && 'is-danger'}"/>
          </div>
          <button class="button is-primary is-outlined has-text-grey ml-2">
            Register Name
          </button>
        </form>
      </div>
    </div>
  </div>