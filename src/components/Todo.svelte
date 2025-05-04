<script lang="ts">
  import {
    setTasksToStorage,
    getTasksFromStorage,
    type Tasks,
    type Task,
  } from "../helpers/manageStorage";
  import { onMount } from "svelte";
  import { timeStringToSeconds } from "../helpers/time";
  import { fade, slide } from "svelte/transition";

  let newTask: Task = {
    label: undefined,
    hour: undefined,
    done: false,
  };
  let tasks: Tasks = [];
  let isLoading = false;
  let errorMessage = "";
  let successMessage = "";

  $: sortedTasks = tasks.sort(
    (a, b) =>
      timeStringToSeconds(a.hour || "00:00") -
      timeStringToSeconds(b.hour || "00:00"),
  );
  $: disabledButton = !newTask.label || !newTask.hour;
  $: taskCount = tasks.length;
  $: completedTaskCount = tasks.filter((task) => task.done).length;

  function showSuccess(message: string) {
    successMessage = message;
    setTimeout(() => {
      successMessage = "";
    }, 3000);
  }

  function showError(message: string) {
    errorMessage = message;
    setTimeout(() => {
      errorMessage = "";
    }, 3000);
  }

  async function addTask() {
    if (!newTask.label || !newTask.hour) return;

    isLoading = true;
    try {
      // Check for duplicate tasks
      if (tasks.some((task) => task.label === newTask.label)) {
        showError("Task already exists!");
        return;
      }

      tasks = [...tasks, newTask];
      await setTasksToStorage(tasks);
      showSuccess("Task added successfully!");

      newTask = {
        label: undefined,
        hour: undefined,
        done: false,
      };
    } catch (err) {
      console.error(err);
      showError("Failed to add task!");
    } finally {
      isLoading = false;
    }
  }

  async function removeTask(taskLabel: string) {
    isLoading = true;
    try {
      const newArray = tasks.filter((task) => task.label !== taskLabel);
      tasks = [...newArray];
      await setTasksToStorage(tasks);
      showSuccess("Task removed successfully!");
    } catch (err) {
      console.error(err);
      showError("Failed to remove task!");
    } finally {
      isLoading = false;
    }
  }

  async function updateTask() {
    isLoading = true;
    try {
      await setTasksToStorage(tasks);
      showSuccess("Task updated!");
    } catch (err) {
      console.error(err);
      showError("Failed to update task!");
    } finally {
      isLoading = false;
    }
  }

  onMount(async () => {
    isLoading = true;
    try {
      const data = await getTasksFromStorage();
      tasks = data || [];
    } catch (err) {
      console.error(err);
      showError("Failed to load tasks!");
    } finally {
      isLoading = false;
    }
  });
</script>

<section class="section">
  <div class="container">
    <div class="box">
      <h2 class="title is-4 has-text-primary">Today's Tasks</h2>

      {#if errorMessage}
        <div class="notification is-danger is-light" transition:fade>
          <button class="delete" on:click={() => (errorMessage = "")}></button>
          {errorMessage}
        </div>
      {/if}

      {#if successMessage}
        <div class="notification is-success is-light" transition:fade>
          <button class="delete" on:click={() => (successMessage = "")}
          ></button>
          {successMessage}
        </div>
      {/if}

      <div class="block">
        <div class="field is-grouped is-grouped-multiline">
          <div class="control is-expanded">
            <input
              bind:value={newTask.label}
              placeholder="What needs to be done?"
              type="text"
              class="input"
              on:keypress={(e) =>
                e.key === "Enter" && !disabledButton && addTask()}
            />
          </div>
          <div class="control">
            <input
              type="time"
              bind:value={newTask.hour}
              min="00:00"
              max="23:59"
              class="input"
              placeholder="Time"
            />
          </div>
          <div class="control">
            <button
              class="button is-primary {isLoading ? 'is-loading' : ''}"
              disabled={disabledButton}
              on:click={addTask}
            >
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>

      {#if taskCount > 0}
        <div class="content">
          <div class="level is-mobile mb-2">
            <div class="level-left">
              <div class="level-item">
                <span class="tag is-info is-light">
                  {completedTaskCount}/{taskCount} completed
                </span>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <progress
                  class="progress is-primary is-small"
                  value={completedTaskCount}
                  max={taskCount}
                >
                  {Math.round((completedTaskCount / taskCount) * 100)}%
                </progress>
              </div>
            </div>
          </div>

          <div class="task-list">
            {#each sortedTasks as task (task.label)}
              <div
                class="box task-item mb-2 pt-3 pb-3"
                class:has-background-success-light={task.done}
                transition:slide
              >
                <div class="columns is-mobile is-vcentered">
                  <div class="column is-narrow">
                    <label class="checkbox">
                      <input
                        type="checkbox"
                        bind:checked={task.done}
                        on:change={updateTask}
                      />
                    </label>
                  </div>
                  <div class="column is-narrow">
                    <span class="tag is-info is-light">{task.hour}</span>
                  </div>
                  <div class="column">
                    <span
                      class:has-text-grey-light={task.done}
                      class:has-text-decoration-line-through={task.done}
                    >
                      {task.label}
                    </span>
                  </div>
                  <div class="column is-narrow">
                    <button
                      class="button is-small is-danger is-light"
                      on:click={() => removeTask(task.label)}
                      title="Delete task"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {:else}
        <div class="notification is-light has-text-centered p-5">
          <p class="is-size-5">
            No tasks for today! Add your first task above.
          </p>
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  .task-item {
    transition: background-color 0.3s ease;
  }

  .has-text-decoration-line-through {
    text-decoration: line-through;
  }

  .task-list {
    max-height: 500px;
    overflow-y: auto;
  }

  /* Optional: Customize scrollbar */
  .task-list::-webkit-scrollbar {
    width: 8px;
  }

  .task-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .task-list::-webkit-scrollbar-thumb {
    background: #dbdbdb;
    border-radius: 4px;
  }

  .task-list::-webkit-scrollbar-thumb:hover {
    background: #b5b5b5;
  }

  /* Add custom delete button styling to be more distinct */
  .button.is-danger.is-light {
    transition: all 0.2s ease;
  }

  .button.is-danger.is-light:hover {
    background-color: #f14668;
    color: white;
  }
</style>
