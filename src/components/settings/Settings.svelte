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
<button class="btn btn-ghost btn-circle" aria-label="Open settings" on:click={setModal}>
    <SettingsIcon/>
</button>
