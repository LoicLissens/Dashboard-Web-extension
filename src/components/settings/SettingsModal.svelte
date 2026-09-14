<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import SettingsTabs from "./SettingsTabs.svelte";
    import { Tab } from "./SettingsTabs.svelte";
    import VideoSettings from "./VideoSettings.svelte";
    import GeneralSettings from "./GeneralSettings.svelte";
    import Modal from "../utils/Modal.svelte";

    export let isModalActive: boolean;

    const dispatch = createEventDispatcher<{ closeModal: null }>();

    let activeTab: Tab = Tab.General;

    function closeModal() {
        dispatch("closeModal");
    }
</script>

<Modal {isModalActive} on:closeModal={closeModal}>
    <div class="h-[70vh] overflow-y-auto">
        <SettingsTabs
            {activeTab}
            on:changeTab={(e) => (activeTab = e.detail)}
        />
        {#if activeTab === Tab.General}
            <GeneralSettings />
        {:else if activeTab === Tab.Videos}
            <VideoSettings />
        {/if}
    </div>
</Modal>
