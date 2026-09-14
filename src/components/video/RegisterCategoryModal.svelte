<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import {
        setCategoriesToStorage,
        getCategoriesFromStorage,
        type Categories,
        type Category,
    } from "../../helpers/manageStorage";
    import { addNotification,NotificationStatus } from "../../store/store";
    import Modal from "../utils/Modal.svelte";

    export let isModalActive: boolean;
    export let existingCategories: Categories;

    let categoryToRegister = "";
    let isDanger = false;

    const dispatch = createEventDispatcher<{
        closeModal: null;
        categoryRegistered: Category;
        categoryDeleted: Category;
    }>();

    function closeModal() {
        isDanger = false;
        categoryToRegister = "";
        dispatch("closeModal")
    }
    const storeCatergory = async (category: Category) => {
        if (!category){
            isDanger = true;
            return;
        }
        if (existingCategories.includes(category)) {
            isDanger = true;
            addNotification(`Category ${category} already exists`, NotificationStatus.Warning);
            return;
        }
        const stockedCatergories = await getCategoriesFromStorage();
        await setCategoriesToStorage([...stockedCatergories, category]);
        dispatch("categoryRegistered", categoryToRegister);
        isDanger = false;
        categoryToRegister = "";
        addNotification("Catergory registered",NotificationStatus.Success);
    };
    const onPressEnter = async (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission
            await storeCatergory(categoryToRegister);
        }
    };
    const deleteCategory = async (category: Category) => {
        await setCategoriesToStorage(existingCategories.filter((e) => e !== category));
        dispatch("categoryDeleted", category);
        addNotification(`Categorie ${category} deleted !`, NotificationStatus.Success);
    };
</script>

<Modal {isModalActive} on:closeModal={closeModal}>
    <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold text-center text-base-content/60">
            Register a video category
        </h1>
        <kbd class="kbd kbd-sm">esc</kbd>
    </div>
    <div class="flex justify-center items-center gap-2 my-4">
        <div>
            <input
                bind:value={categoryToRegister}
                placeholder="Category"
                type="text"
                class="input input-bordered {isDanger ? 'input-error' : ''}"
                on:keydown={onPressEnter}
            />
        </div>
        <button
            class="btn btn-primary btn-outline"
            on:click={() => storeCatergory(categoryToRegister)}
            >Register Category</button
        >
    </div>
    <div>
        <h2>Existing categories :</h2>
        <div class="flex flex-wrap gap-1">
            {#each existingCategories as category}
                <span class="badge gap-1"
                    >{category}<button
                        class="btn btn-xs btn-circle btn-ghost"
                        aria-label={`Delete category ${category}`}
                        on:click={()=>deleteCategory(category)}
                    >✕</button></span
                >
            {/each}
        </div>
    </div></Modal
>
