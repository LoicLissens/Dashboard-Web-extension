<script>
    import { createEventDispatcher } from "svelte";
    import {
        setTobrowserStorage,
        getFromBrowserStorage,
        storageKeys
    } from "../../helpers/manageStorage";
    import { addNotification } from "../../store/store";
    import {clickOutside} from "../../helpers/clickOutside";

    export let isModalActive;
    let categoryToRegister = "";
    let isDanger = false;

    const dispatch = createEventDispatcher();
    function closeModal() {
        dispatch("closeModal")
    }
    const storeCatergory = async (category) => {
        if (!category) {
            isDanger = true;
            return;
        }
        const stockedCatergories = await getFromBrowserStorage(storageKeys.CATEGORIES);
        const tempCategories = stockedCatergories
            ? [...stockedCatergories]
            : [];
        await setTobrowserStorage(storageKeys.CATEGORIES, [...tempCategories, category]);
        dispatch("categoryRegistered", categoryToRegister);
        isDanger = false;
        categoryToRegister = "";
        addNotification({
            message: "Catergory registered",
            status: "success",
        });
    };
    const onEnterPress = async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            await storeCatergory(categoryToRegister);
        }
    };
</script>

<div class="modal {isModalActive && 'is-active'}">
    <div class="modal-background blur"></div>
    <div class="modal-content box"  use:clickOutside on:click_outside={closeModal}>
        <h1
            class="title has-text-weight-semibold has-text-centered has-text-grey"
        >
            Register a video category
        </h1>
        <div class="is-flex is-justify-content-center">
            <div class="px-2">
                <input
                    bind:value={categoryToRegister}
                    placeholder="Category"
                    type="text"
                    class="input {isDanger && 'is-danger'}"
                    on:keydown={onEnterPress}
                />
            </div>
            <button
                class="button is-primary is-outlined has-text-grey"
                on:click={() => storeCatergory(categoryToRegister)}
                >Register Category</button
            >
        </div>
    </div>
</div>
