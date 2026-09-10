<script lang="ts">
    import { onMount } from "svelte";
    import {getFromBrowserStorage,StorageKeys,setTobrowserStorage, Theme} from "../helpers/manageStorage"
    import ThemeIcon from "./icons/ThemeIcon.svelte";

    let theme: Theme;

    const applyTheme = (next: Theme) => {
        document.documentElement.setAttribute('data-theme', next);
        // Mirrored so the inline script in index.html can apply the theme
        // before first paint; chrome.storage is async and too late for that.
        // chrome.storage remains the source of truth for config export/import.
        try {
            localStorage.setItem(StorageKeys.THEME, next);
        } catch (e) {
            // Storage can be unavailable (private mode, blocked site data).
            // The theme still applies for this session.
        }
    }
    const toggleTheme = () => {
        theme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
        setTobrowserStorage(StorageKeys.THEME, theme);
        applyTheme(theme);
    };
    onMount(async() => {
        const registeredTheme = await getFromBrowserStorage(StorageKeys.THEME);
        if (registeredTheme) {
            theme = registeredTheme as Theme;
            applyTheme(theme);
            return;
        }
        const systemtThemeIsDark = window.matchMedia(`(prefers-color-scheme: ${Theme.DARK})`).matches;
        theme = systemtThemeIsDark ? Theme.DARK : Theme.LIGHT;
        applyTheme(theme);
    });
</script>

<button class="btn btn-ghost btn-circle" aria-label="Toggle theme" on:click={() => toggleTheme()}>
    <ThemeIcon theme={theme}/>
</button>
