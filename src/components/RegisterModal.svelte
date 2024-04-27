<script>
    import { createEventDispatcher } from 'svelte';

    export let isModalActive = true;
    let nameError;

    const dispatch = createEventDispatcher();
    const toggleModal = () => {
      isModalActive = !isModalActive;
    };
    function setName (e) {
      e.preventDefault();
      const val = e.target.elements.name.value;
      if (!val) {
        nameError = "This fields cannot be empty";
      }
      dispatch('setName', { name: val });
      toggleModal();
    }
  </script>

  <div class={`modal ${isModalActive ? 'is-active' : ''}`}>
    <div class="modal-background blur"></div>
    <div class="modal-content">
      <!-- Any other Bulma elements you want -->
      <div class="box">
        <h1 class="title">Modal Title</h1>
        <form on:submit|preventDefault={setName} class="columns">
          <input name="name" type="text"  placeholder="Name" class="input column is-narrow"/>
          <input type="submit" class="button column is-narrow" />
          {#if nameError}
            <p  class="column is-narrow">{nameError}</p>
          {/if}
        </form>
      </div>
    </div>
  </div>

  <style>
    .blur {
      backdrop-filter: blur(5px);
    }
  </style>