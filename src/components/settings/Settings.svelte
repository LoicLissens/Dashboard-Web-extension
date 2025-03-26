<script lang="ts">
    import SettingsModal from "./SettingsModal.svelte";
    import SettingsIcon from "../icons/SettingsIcon.svelte";
    let isModalActive = false;
    const setModal =  () => {
        isModalActive = true;
    }
</script>
{#if isModalActive}
    <SettingsModal {isModalActive} on:closeModal={() => isModalActive = false } />
{/if}
<button on:click={setModal}>
    <SettingsIcon/>
</button>
