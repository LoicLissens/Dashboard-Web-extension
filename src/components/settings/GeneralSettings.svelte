<script lang="ts">
    import {
        clearStorage,
        getUserConfigFromStorage,

    } from "../../helpers/manageStorage";
    import CodeBlock from "../utils/CodeBlock.svelte";
    import Expander from "../utils/Expander.svelte";
    import ConfigFileUploader from "./ConfigFileUploader.svelte";


    let JSONConfig: string;

    const getJSONConfig = async (): Promise<void> => {
        if (!JSONConfig) {
            const config = await getUserConfigFromStorage();
            config.configVersion = "1.0.0"
            JSONConfig = JSON.stringify(
                config,
                null,
                "\t",
            );
        }
    };

    const downloadConfig = async (): Promise<void> => {
        await getJSONConfig();
        const filename = `config_${new Date().toLocaleDateString("fr-BE")}.json`;
        const blob = new Blob([JSONConfig], {
            type: "application/json",
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const clearConfig = async (): Promise<void> => {
        if (confirm("Are you sure to delete the entire config ?")) {
            await clearStorage();
            location.reload();
        }
    };

</script>

<div>
    <section>
        <h5 class="title is-5 has-text-grey my-2">Config JSON file</h5>
        <button class="button is-success is-outlined" on:click={downloadConfig}>
            <span>Download</span>
            <span class="icon is-small">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></g><g id="SVGRepo_iconCarrier">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8 10C8 7.79086 9.79086 6 12 6C14.2091 6 16 7.79086 16 10V11H17C18.933 11 20.5 12.567 20.5 14.5C20.5 16.433 18.933 18 17 18H16.9C16.3477 18 15.9 18.4477 15.9 19C15.9 19.5523 16.3477 20 16.9 20H17C20.0376 20 22.5 17.5376 22.5 14.5C22.5 11.7793 20.5245 9.51997 17.9296 9.07824C17.4862 6.20213 15.0003 4 12 4C8.99974 4 6.51381 6.20213 6.07036 9.07824C3.47551 9.51997 1.5 11.7793 1.5 14.5C1.5 17.5376 3.96243 20 7 20H7.1C7.65228 20 8.1 19.5523 8.1 19C8.1 18.4477 7.65228 18 7.1 18H7C5.067 18 3.5 16.433 3.5 14.5C3.5 12.567 5.067 11 7 11H8V10ZM13 11C13 10.4477 12.5523 10 12 10C11.4477 10 11 10.4477 11 11V16.5858L9.70711 15.2929C9.31658 14.9024 8.68342 14.9024 8.29289 15.2929C7.90237 15.6834 7.90237 16.3166 8.29289 16.7071L11.2929 19.7071C11.6834 20.0976 12.3166 20.0976 12.7071 19.7071L15.7071 16.7071C16.0976 16.3166 16.0976 15.6834 15.7071 15.2929C15.3166 14.9024 14.6834 14.9024 14.2929 15.2929L13 16.5858V11Z"
                            fill="currentColor"
                        ></path>
                    </g></svg
                >
            </span>
        </button>
        <ConfigFileUploader/>
        <button class="button is-danger is-outlined is-light" on:click={clearConfig}>
            Delete config
        </button>
        <Expander title="Current config" titleSize="is-6" expanded={false}>
            {#await getJSONConfig()}
                <p class="is-skeleton"></p>
            {:then}
                <CodeBlock code={JSONConfig} />
            {:catch error}
                <p>Error: {error.message}</p>
            {/await}
        </Expander>
    </section>
</div>
