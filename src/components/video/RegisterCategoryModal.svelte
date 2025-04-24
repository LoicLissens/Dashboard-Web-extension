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

    const dispatch = createEventDispatcher();

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
    <div class="is-flex is-justify-content-space-between">
        <h1
            class="title has-text-weight-semibold has-text-centered has-text-grey"
        >
            Register a video category
        </h1>
        <kbd class="key">esc</kbd>
    </div>
    <div class="is-flex is-justify-content-center">
        <div class="px-2">
            <input
                bind:value={categoryToRegister}
                placeholder="Category"
                type="text"
                class="input {isDanger && 'is-danger'}"
                on:keydown={onPressEnter}
            />
        </div>
        <button
            class="button is-primary is-outlined has-text-grey"
            on:click={() => storeCatergory(categoryToRegister)}
            >Register Category</button
        >
    </div>
    <div>
        <h2>Existing categories :</h2>
        <div class="tags">
            {#each existingCategories as category}
                <span class="tag mr-1"
                    >{category}<button
                        class="delete is-small"
                        on:click={()=>deleteCategory(category)}
                    ></button></span
                >
            {/each}
        </div>
    </div></Modal
>
