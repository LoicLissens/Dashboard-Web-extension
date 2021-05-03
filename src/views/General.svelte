<script>
  import { onMount } from "svelte";
  import browser from "webextension-polyfill";
  import { date } from "../store/store";
  import { greeting, msToDate } from "../helpers/time";
  import DayliRoutine from "../components/DayliRoutine.svelte";
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
    console.log(process.env.LOL);
    browser.storage.local
      .get("name")
      .then((data) => {
        name = data.name;
      })
      .catch((err) => {
        console.error(err);
      });
  });
</script>

<section>
  {@html '\u003ciframe width="480" height="270" src="//www.youtube.com/embed/BKQVqzhnP8I" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen\u003e\u003c/iframe\u003e'}
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
  <DayliRoutine />
  <article>
    <h2>Colors:</h2>
    <iframe src="https://colorhunt.co/tab.php" title="colorhunt" />
  </article>
</section>

<style>
  h2 {
    text-align: center;
  }
  section {
    width: 80%;
    margin: auto;
  }
  iframe {
    width: 100%;
    height: 75vh;
  }
</style>
