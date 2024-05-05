<script>
    import { onMount, onDestroy } from "svelte";
    import SettingsTabs from "./SettingsTabs.svelte";
    export let isModalActive = true;

    let keydownHandler;
    const settings = [
        //TODO: Change the way tab is handled is creepy right now
        { label: "Home", state: "home" },
        { label: "Videos", state: "videos" },
    ];
    let activeTab = "general";

    onMount(() => {
        keydownHandler = function (event) {
            if (event.key === "Escape") {
                isModalActive = false;
            }
        };

        window.addEventListener("keydown", keydownHandler);
    });
    onDestroy(() => {
        window.removeEventListener("keydown", keydownHandler);
    });
</script>

<div class="modal {isModalActive && 'is-active'}">
    <div class="modal-background blur"></div>
    <div class="modal-content">
        <div class="box">
            <SettingsTabs
                {activeTab}
                on:changeTab={(e) => (activeTab = e.detail)}
            />
        </div>
    </div>
</div>
