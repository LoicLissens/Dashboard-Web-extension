
<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { createEventDispatcher } from "svelte";
    import { clickOutside } from "../../helpers/clickOutside";
    import SettingsTabs from "./SettingsTabs.svelte";
    import { Tab } from "./SettingsTabs.svelte";
    import VideoSettings from "./VideoSettings.svelte";
    import GeneralSettings from "./GeneralSettings.svelte";

    export let isModalActive: boolean;

    const dispatch = createEventDispatcher();
    let keydownHandler: (evt: KeyboardEvent) => void;

    let activeTab: Tab = Tab.General;

    function closeModal() {
        dispatch("closeModal");
    }
    onMount(() => {
        keydownHandler = function (event: KeyboardEvent) {
            if (event.key === "Escape") {
                closeModal();
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
    <div class="modal-content" use:clickOutside on:click_outside={closeModal}>
        <div class="box" style="height: 70vh;">
            <SettingsTabs
                {activeTab}
                on:changeTab={(e) => (activeTab = e.detail)}
            />
            {#if activeTab === "general"}
                <GeneralSettings />
            {:else if activeTab === "videos"}
                <VideoSettings />
            {/if}
        </div>
    </div>
</div>
