<script lang="ts">
    import {
        clearStorage,
        validateUserConfig,
        setFullConfigToStorage,
    } from "../../helpers/manageStorage";
    import { addNotification, NotificationStatus } from "../../store/store";

    const uploadConfig = (e: Event): void => {
        const input = e.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) {
            return;
        }
        const file = input.files[0];
        if (file.type !== "application/json") {
            alert("Please upload a valid JSON file");
            return;
        }
        const reader = new FileReader();
        reader.onload = async function (e: ProgressEvent<FileReader>) {
            try {
                const content = e.target?.result as string;
                const parsedData: unknown = JSON.parse(content);
                const userConfig = validateUserConfig(parsedData);
                await clearStorage();
                await setFullConfigToStorage(userConfig);
                window.location.reload();
            } catch (error) {
                addNotification("Invalid config file",NotificationStatus.Error)
            }
        };

        reader.onerror = function () {
            console.log(reader.error);
        };
        reader.readAsText(file);
    };
</script>

<!-- daisyUI puts `file-input` directly on the input; Bulma's
     file/file-label/file-cta wrappers are gone. -->
<input
    class="file-input file-input-primary"
    type="file"
    accept="application/JSON"
    aria-label="Upload config"
    on:change={uploadConfig}
/>
