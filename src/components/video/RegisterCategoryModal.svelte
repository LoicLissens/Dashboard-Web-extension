<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { createEventDispatcher } from "svelte";
    import {
        setCategoriesToStorage,
        getCategoriesFromStorage,
        type Categories,
        type Category
    } from "../../helpers/manageStorage";
    import { addNotification } from "../../store/store";
    import {clickOutside} from "../../helpers/clickOutside.js";

    export let isModalActive:boolean;
    export let existingCategories:Categories;

    let keydownHandler:(evt: KeyboardEvent) => void;
    let categoryToRegister = "";
    let isDanger = false;

    const dispatch = createEventDispatcher();
    function closeModal() {
        dispatch("closeModal")
    }
    //TODO Create a component for esc KBD with the logic to close modal inside
    onMount(() => {
        keydownHandler = function (event) {
            if (event.key === "Escape") {
                closeModal()
            }
        };

        window.addEventListener("keydown", keydownHandler);
    });
    onDestroy(() => {
        window.removeEventListener("keydown", keydownHandler);
    });
    const storeCatergory = async (category:Category) => {
        if (!category) {
            isDanger = true;
            return;
        }
        const stockedCatergories = await getCategoriesFromStorage()
        await setCategoriesToStorage([...stockedCatergories, category]);
        dispatch("categoryRegistered", categoryToRegister);
        isDanger = false;
        categoryToRegister = "";
        addNotification({
            message: "Catergory registered",
            status: "success",
        });
    };
    const onPressEnter = async (event:KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            await storeCatergory(categoryToRegister);
        }
    };
    const deleteCategory = async (category:Category) => {
        const tempCategories = existingCategories.filter((e) => e !== category);
        await setCategoriesToStorage(tempCategories);
        existingCategories = tempCategories;
        addNotification({
            message: `Categorie ${category} deleted !`,
            status: "success",
        })
    };
</script>

<div class="modal {isModalActive && 'is-active'}">
    <div class="modal-background blur"></div>
    <div class="modal-content box"  use:clickOutside on:click_outside={closeModal}>
        <div class="is-flex">
            <h1
            class="title has-text-weight-semibold has-text-centered has-text-grey"
        >
            Register a video category
        </h1>
        <kbd class="key is-align-content-end">esc</kbd>
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
        <div >
            <h2>Existing categories : </h2>
            <div class="tags">
                {#each existingCategories as category}
                    <span class="tag mr-1">{category}<button class="delete is-small" on:click={deleteCategory(category)}></button></span>
                {/each}
            </div>

        </div>
    </div>
</div>

