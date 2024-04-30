<script>
    export let isModalActive = true;
    let categoryToRegister = "";

    const storeCatergory = async (category) => {
        const stockedCatergories = await getFromBrowserStorage("categories");
        const tempCategories = stockedCatergories.categories
            ? [...stockedCatergories.categories]
            : [];
        await setTobrowserStorage("categories", [...tempCategories, category]);
        // categories = [...tempCategories, category]; //TODO: pass to parent comp
        categoryToRegister = "";
    };
</script>

<div class="modal {isModalActive && 'is-active'}">
    <div class="modal-background blur"></div>
    <div class="modal-content">
        <p class="has-text-weight-semibold">No categories registered</p>
        <div class="px-2">
            <input
                bind:value={categoryToRegister}
                placeholder="Category"
                type="text"
                class="input"
            />
        </div>
        <button
            class="button is-primary is-outlined has-text-grey"
            on:click={() => storeCatergory(categoryToRegister)}
            >Register Category</button
        >
    </div>
</div>
