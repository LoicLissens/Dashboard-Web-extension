<script>
  import {
    setTobrowserStorage,
    getFromBrowserStorage,
    storageKeys
  } from "../helpers/manageStorage";
  import { onMount } from "svelte";
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
    setTobrowserStorage(storageKeys.TASKS, tasks).catch((err) => {
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
    setTobrowserStorage(storageKeys.TASKS, tasks).catch((err) => {
      console.log(err);
    });
  }
  function updateTask() {
    setTobrowserStorage(storageKeys.TASKS, tasks).catch((err) => {
      console.log(err);
    });
  }
  onMount(() => {
    getFromBrowserStorage(storageKeys.TASKS)
      .then((data) => {
        tasks = data || [];
      })
      .catch((err) => {
        console.error(err);
      });
  });
</script>

<article>
  <h2>Today task's:</h2>
  <div class="columns">
    <div class="column is-narrow">
        <input bind:value={newTask.label} placeholder="Task" type="text" class="input"/>
    </div>
    <div class="column is-narrow">
        <input type="time" bind:value={newTask.hour} min="00:00" max="23:59"  class="input"/>
    </div>
    <div class="column is-narrow">
        <button class="button" disabled={disabledButton} on:click={addTask}>Add a task !</button>
    </div>
</div>
  {#if tasks.length > 0}
    {#each sortedTasks as task}
      <div class="columns">
        <div class="column is-narrow">
          <label class="checkbox">
            <input
            type="checkbox"
            bind:checked={task.done}
            on:change={updateTask}
          />
          </label>
        </div>
        <div class="column is-narrow">{task.hour}h</div>
        <div class="column is-narrow">{task.label}</div>
        <button cla on:click={removeTask(task.label)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="1.3rem" height="1.3rem">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
        </button>
      </div>
    {/each}
  {:else}
    <p>No tasks added</p>
  {/if}
</article>


