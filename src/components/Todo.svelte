<script lang="ts">
  import {
    setTasksToStorage,
    getTasksFromStorage,
    getTaskCategoriesFromStorage,
    setTaskCategoriesToStorage,
    BUILT_IN_TASK_CATEGORIES,
    TASK_CATEGORY_PERSO,
    TASK_CATEGORY_WORK,
    Priority,
    type Tasks,
    type Task,
    type Categories,
    type Category,
  } from "../helpers/manageStorage";
  import { onMount } from "svelte";
  import { fade, slide } from "svelte/transition";
  import { isWorkingHours } from "../helpers/time";
  import CategoryModal from "./utils/CategoryModal.svelte";

  const PRIORITIES = [Priority.URGENT, Priority.HIGH, Priority.MEDIUM, Priority.LOW];
  const PRIORITY_LABEL: Record<Priority, string> = {
    [Priority.URGENT]: "Urgent",
    [Priority.HIGH]: "High",
    [Priority.MEDIUM]: "Medium",
    [Priority.LOW]: "Low",
  };
  const PRIORITY_BADGE: Record<Priority, string> = {
    [Priority.URGENT]: "badge-error",
    [Priority.HIGH]: "badge-warning",
    [Priority.MEDIUM]: "badge-info",
    [Priority.LOW]: "badge-neutral",
  };

  let newTask: Omit<Task, "category"> = {
    label: "",
    priority: Priority.MEDIUM,
    done: false,
  };
  let tasks: Tasks = [];
  let customCategories: Categories = [];
  let selectedCategory: Category = isWorkingHours(new Date())
    ? TASK_CATEGORY_WORK
    : TASK_CATEGORY_PERSO;
  let isCategoryModalActive = false;
  let isLoading = false;
  let errorMessage = "";
  let successMessage = "";

  $: categories = [...BUILT_IN_TASK_CATEGORIES, ...customCategories];
  $: sortedTasks = tasks.sort(
    (a, b) => PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority),
  );
  $: visibleTasks = sortedTasks.filter(
    (task) =>
      (categories.includes(task.category) ? task.category : TASK_CATEGORY_PERSO) ===
      selectedCategory,
  );
  $: disabledButton = !newTask.label;

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
    if (!newTask.label) return;

    isLoading = true;
    try {
      // Check for duplicate tasks
      if (tasks.some((task) => task.label === newTask.label)) {
        showError("Task already exists!");
        return;
      }

      tasks = [...tasks, { ...newTask, category: selectedCategory }];
      await setTasksToStorage(tasks);
      showSuccess("Task added successfully!");

      newTask = {
        label: "",
        priority: Priority.MEDIUM,
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

  async function registerCategory(category: Category) {
    customCategories = [...customCategories, category];
    await setTaskCategoriesToStorage(customCategories);
    selectedCategory = category;
    isCategoryModalActive = false;
  }

  async function deleteCategory(category: Category) {
    customCategories = customCategories.filter((c) => c !== category);
    await setTaskCategoriesToStorage(customCategories);
    if (tasks.some((task) => task.category === category)) {
      tasks = tasks.map((task) =>
        task.category === category ? { ...task, category: TASK_CATEGORY_PERSO } : task,
      );
      await setTasksToStorage(tasks);
    }
    if (selectedCategory === category) selectedCategory = TASK_CATEGORY_PERSO;
  }

  onMount(async () => {
    isLoading = true;
    try {
      const [data, storedCategories] = await Promise.all([
        getTasksFromStorage(),
        getTaskCategoriesFromStorage(),
      ]);
      tasks = data || [];
      customCategories = storedCategories;
    } catch (err) {
      console.error(err);
      showError("Failed to load tasks!");
    } finally {
      isLoading = false;
    }
  });
</script>

<div class="flex flex-col gap-2">
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

        <CategoryModal
          isModalActive={isCategoryModalActive}
          title="Task categories"
          existingCategories={categories}
          lockedCategories={BUILT_IN_TASK_CATEGORIES}
          on:categoryRegistered={(e) => registerCategory(e.detail)}
          on:categoryDeleted={(e) => deleteCategory(e.detail)}
          on:closeModal={() => (isCategoryModalActive = false)}
        />

        <div class="flex items-center gap-2">
          <select
            bind:value={selectedCategory}
            class="select select-sm w-40"
            aria-label="Category"
          >
            {#each categories as category}
              <option value={category}>{category}</option>
            {/each}
          </select>
          <button
            class="btn btn-ghost btn-sm"
            on:click={() => (isCategoryModalActive = true)}
          >
            Manage categories
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-2 mb-4">
          <input
            bind:value={newTask.label}
            placeholder="What needs to be done?"
            type="text"
            class="input flex-1 min-w-48"
            on:keypress={(e) =>
              e.key === "Enter" && !disabledButton && addTask()}
          />
          <select
            bind:value={newTask.priority}
            class="select w-36"
            aria-label="Priority"
          >
            {#each PRIORITIES as priority}
              <option value={priority}>{PRIORITY_LABEL[priority]}</option>
            {/each}
          </select>
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

        {#if visibleTasks.length > 0}
          <div>
            <div class="task-list">
              {#each visibleTasks as task (task.label)}
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
                    <span
                      class="badge badge-soft w-20 shrink-0 {PRIORITY_BADGE[
                        task.priority
                      ]}">{PRIORITY_LABEL[task.priority]}</span
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
              No {selectedCategory} tasks. Add one above.
            </p>
          </div>
        {/if}
</div>

<style>
  .task-list {
    max-height: 500px;
    overflow-y: auto;
    scrollbar-width: thin;
  }
</style>
