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
  import { slide } from "svelte/transition";
  import { isWorkingHours } from "../helpers/time";
  import { addNotification, NotificationStatus } from "../store/store";
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
  let editingTask: Task | null = null;
  let editLabel = "";
  let editPriority = Priority.MEDIUM;
  let editCategory: Category = TASK_CATEGORY_PERSO;

  $: categories = [...BUILT_IN_TASK_CATEGORIES, ...customCategories];
  $: sortedTasks = tasks.sort(
    (a, b) =>
      Number(Boolean(a.done)) - Number(Boolean(b.done)) ||
      PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority),
  );
  $: visibleTasks = sortedTasks.filter(
    (task) =>
      (categories.includes(task.category) ? task.category : TASK_CATEGORY_PERSO) ===
      selectedCategory,
  );
  $: disabledButton = !newTask.label;

  async function addTask() {
    if (!newTask.label) return;

    isLoading = true;
    try {
      // Check for duplicate tasks
      if (tasks.some((task) => task.label === newTask.label)) {
        addNotification("Task already exists!", NotificationStatus.Error);
        return;
      }

      tasks = [...tasks, { ...newTask, category: selectedCategory }];
      await setTasksToStorage(tasks);
      addNotification("Task added successfully!", NotificationStatus.Success);

      newTask = {
        label: "",
        priority: Priority.MEDIUM,
        done: false,
      };
    } catch (err) {
      console.error(err);
      addNotification("Failed to add task!", NotificationStatus.Error);
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
      addNotification("Task removed successfully!", NotificationStatus.Success);
    } catch (err) {
      console.error(err);
      addNotification("Failed to remove task!", NotificationStatus.Error);
    } finally {
      isLoading = false;
    }
  }

  async function updateTask() {
    isLoading = true;
    tasks = tasks;
    try {
      await setTasksToStorage(tasks);
      addNotification("Task updated!", NotificationStatus.Success);
    } catch (err) {
      console.error(err);
      addNotification("Failed to update task!", NotificationStatus.Error);
    } finally {
      isLoading = false;
    }
  }

  function startEdit(task: Task) {
    editingTask = task;
    editLabel = task.label;
    editPriority = task.priority;
    editCategory = task.category;
  }

  function cancelEdit() {
    editingTask = null;
  }

  async function saveEdit() {
    if (!editingTask || !editLabel) return;
    if (editLabel !== editingTask.label && tasks.some((task) => task.label === editLabel)) {
      addNotification("Task already exists!", NotificationStatus.Error);
      return;
    }
    Object.assign(editingTask, {
      label: editLabel,
      priority: editPriority,
      category: editCategory,
    });
    editingTask = null;
    await updateTask();
  }

  function onEditKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") saveEdit();
    if (event.key === "Escape") cancelEdit();
  }

  function focus(node: HTMLInputElement) {
    node.focus();
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
      addNotification("Failed to load tasks!", NotificationStatus.Error);
    } finally {
      isLoading = false;
    }
  });
</script>

<div class="flex flex-col gap-2">
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
              {#each visibleTasks as task (task)}
                <div
                  class="card mb-2 transition-colors {task.done
                    ? 'bg-success/20'
                    : 'bg-base-200'}"
                  transition:slide
                >
                  <div class="card-body flex-row items-center gap-3 py-3">
                    {#if editingTask === task}
                      <input
                        class="input input-sm flex-1 min-w-32"
                        aria-label="Task name"
                        bind:value={editLabel}
                        on:keydown={onEditKeydown}
                        use:focus
                      />
                      <select
                        class="select select-sm w-28 shrink-0"
                        aria-label="Priority"
                        bind:value={editPriority}
                      >
                        {#each PRIORITIES as priority}
                          <option value={priority}>{PRIORITY_LABEL[priority]}</option>
                        {/each}
                      </select>
                      <select
                        class="select select-sm w-32 shrink-0"
                        aria-label="Category"
                        bind:value={editCategory}
                      >
                        {#each categories as category}
                          <option value={category}>{category}</option>
                        {/each}
                      </select>
                      <button
                        class="btn btn-sm btn-primary btn-soft shrink-0"
                        disabled={!editLabel}
                        on:click={saveEdit}
                      >
                        Save
                      </button>
                      <button class="btn btn-sm btn-ghost shrink-0" on:click={cancelEdit}>
                        Cancel
                      </button>
                    {:else}
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
                        class="btn btn-sm btn-ghost shrink-0"
                        on:click={() => startEdit(task)}
                        title="Edit task"
                      >
                        Edit
                      </button>
                      <button
                        class="btn btn-sm btn-error btn-soft shrink-0"
                        on:click={() => removeTask(task.label)}
                        title="Delete task"
                      >
                        Delete
                      </button>
                    {/if}
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
