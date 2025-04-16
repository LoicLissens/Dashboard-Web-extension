<script lang="ts">
    import {
        clearStorage,
        validateUserConfig,
        setFullConfigToStorage,
    } from "../../helpers/manageStorage";
    import { addNotification, NotificationStatus } from "../../store/store";
    interface ParsedData {
        [key: string]: any;
    }

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
                const parsedData: ParsedData = JSON.parse(content);
                const userConfig = validateUserConfig(parsedData);
                await clearStorage();
                await setFullConfigToStorage(userConfig);
                window.location.reload();
            } catch (error) {
                addNotification({
                    message: "Invalid config file",
                    status: NotificationStatus.Error,
                });
            }
        };

        reader.onerror = function () {
            console.log(reader.error);
        };
        reader.readAsText(file);
    };
</script>

<div class="file is-inline-block is-info">
    <label class="file-label">
        <input
            class="file-input"
            type="file"
            accept="application/JSON"
            on:change={uploadConfig}
        />
        <span class="file-cta">
            <span class="file-label"> Upload Config </span>
        </span>
    </label>
</div>
