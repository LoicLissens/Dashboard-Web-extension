<script>
  import DayliRoutine from "../components/DayliRoutine.svelte";
  import Colors from "../components/Colors.svelte";
  import Date from "../components/Date.svelte";
  import GeneralSettings from "../components/GeneralSettings.svelte";
  let settingsOn = false;
</script>

<section>
  {#if settingsOn}
    <GeneralSettings />
  {/if}
  <Date />
  <DayliRoutine />
  <Colors />
</section>

<style>
  section {
    width: 70%;
    margin: auto;
  }
</style>
