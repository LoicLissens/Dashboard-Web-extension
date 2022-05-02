<script>
  import {
    setTobrowserStorage,
    getFromBrowserStorage,
  } from "../helpers/manageStorage";
  import browser from "webextension-polyfill";
  import { onMount } from "svelte";
  import Date from "./Date.svelte";
  import { timeStringToSeconds } from "../helpers/time";
  let newTask = {
    label: undefined,
    hour: undefined,
    done: false,
  };
  let tasks = [];
  $: sortedTasks = tasks.sort(
    (a, b) => timeStringToSeconds(a.hour) - timeStringToSeconds(b.hour)
  );
  $: disabledButton = newTask.label && newTask.hour ? false : true;
  function addTask() {
    tasks = [...tasks, newTask];
    setTobrowserStorage("tasks", tasks).catch((err) => {
      console.log(err);
    });
    newTask = {
      label: undefined,
      hour: undefined,
      done: false,
    };
  }
  function removeTask(taskToDelete) {
    const newArray = tasks.filter((task) => task.label != taskToDelete);
    tasks = [...newArray];
    setTobrowserStorage("tasks", tasks).catch((err) => {
      console.log(err);
    });
  }
  function updateTask() {
    setTobrowserStorage("tasks", tasks).catch((err) => {
      console.log(err);
    });
  }
  onMount(() => {
    getFromBrowserStorage("tasks")
      .then((data) => {
        tasks = data.tasks || [];
      })
      .catch((err) => {
        console.error(err);
      });
  });
</script>

<article>
  <h2>Routine</h2>
  <div>
    <input bind:value={newTask.label} placeholder="Task" type="text" />
    <input type="time" bind:value={newTask.hour} min="00:00" max="23:59" />
    <button disabled={disabledButton} on:click={addTask}>Add a task !</button>
  </div>
  {#if tasks.length > 0}
    {#each sortedTasks as task}
      <div>
        <span>{task.hour}h</span>
        <span>{task.label}</span>
        <span
          ><input
            type="checkbox"
            bind:checked={task.done}
            on:change={updateTask}
          /></span
        >
        <span class="delete" on:click={removeTask(task.label)}>❌</span>
      </div>
    {/each}
  {:else}
    <p>No tasks added</p>
  {/if}
</article>

<style>
  .delete {
    cursor: pointer;
  }
</style>
