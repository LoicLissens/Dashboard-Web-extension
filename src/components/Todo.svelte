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
    label: "",
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
        label: "",
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

<section class="py-8">
  <div class="container mx-auto">
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h2 class="text-2xl font-bold text-primary">Today's Tasks</h2>

        {#if errorMessage}
          <div class="alert alert-error alert-soft" transition:fade>
            <span>{errorMessage}</span>
            <button
              class="btn btn-sm btn-circle btn-ghost"
              aria-label="Dismiss error"
              on:click={() => (errorMessage = "")}>✕</button
            >
          </div>
        {/if}

        {#if successMessage}
          <div class="alert alert-success alert-soft" transition:fade>
            <span>{successMessage}</span>
            <button
              class="btn btn-sm btn-circle btn-ghost"
              aria-label="Dismiss message"
              on:click={() => (successMessage = "")}>✕</button
            >
          </div>
        {/if}

        <div class="flex flex-wrap items-center gap-2 mb-4">
          <input
            bind:value={newTask.label}
            placeholder="What needs to be done?"
            type="text"
            class="input flex-1 min-w-48"
            on:keypress={(e) =>
              e.key === "Enter" && !disabledButton && addTask()}
          />
          <input
            type="time"
            bind:value={newTask.hour}
            min="00:00"
            max="23:59"
            class="input"
            placeholder="Time"
          />
          <button
            class="btn btn-primary"
            disabled={disabledButton}
            on:click={addTask}
          >
            {#if isLoading}
              <span class="loading loading-spinner"></span>
            {/if}
            <span>Add Task</span>
          </button>
        </div>

        {#if taskCount > 0}
          <div>
            <div class="flex justify-between items-center gap-4 mb-2">
              <span class="badge badge-info badge-soft">
                {completedTaskCount}/{taskCount} completed
              </span>
              <progress
                class="progress progress-primary w-56"
                value={completedTaskCount}
                max={taskCount}
              >
                {Math.round((completedTaskCount / taskCount) * 100)}%
              </progress>
            </div>

            <div class="task-list">
              {#each sortedTasks as task (task.label)}
                <div
                  class="card mb-2 transition-colors {task.done
                    ? 'bg-success/20'
                    : 'bg-base-200'}"
                  transition:slide
                >
                  <div class="card-body flex-row items-center gap-3 py-3">
                    <input
                      type="checkbox"
                      class="checkbox shrink-0"
                      aria-label="Mark task done"
                      bind:checked={task.done}
                      on:change={updateTask}
                    />
                    <span class="badge badge-info badge-soft shrink-0"
                      >{task.hour}</span
                    >
                    <span
                      class="flex-1 {task.done
                        ? 'line-through text-base-content/40'
                        : ''}"
                    >
                      {task.label}
                    </span>
                    <button
                      class="btn btn-sm btn-error btn-soft shrink-0"
                      on:click={() => removeTask(task.label)}
                      title="Delete task"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {:else}
          <div class="alert text-center p-5">
            <p class="text-lg">
              No tasks for today! Add your first task above.
            </p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  .task-list {
    max-height: 500px;
    overflow-y: auto;
    scrollbar-width: thin;
  }
</style>
