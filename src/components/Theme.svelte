<script lang="ts">
    import { onMount } from "svelte";
    import {getFromBrowserStorage,StorageKeys,setTobrowserStorage, Theme} from "../helpers/manageStorage"
    import ThemeIcon from "./icons/ThemeIcon.svelte";

    let theme:Theme;
    const changeTheme = (them: Theme) => {
        const  htmlElement = document.querySelector('html') as HTMLElement;
        htmlElement.setAttribute('data-theme', theme);
    }
    const toggleTheme = () => {
        theme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
        setTobrowserStorage(StorageKeys.THEME, theme);
        changeTheme(theme);
    };
    onMount(async() => {
        const registeredTheme= await getFromBrowserStorage(StorageKeys.THEME);
        if (registeredTheme) {
            theme = registeredTheme as Theme;
            changeTheme(theme);
            return;
        }
        const systemtThemeIsDark = window.matchMedia(`(prefers-color-scheme: ${Theme.DARK})`).matches;
        theme = systemtThemeIsDark ? Theme.DARK : Theme.LIGHT;
    });
</script>

<button on:click={()=> toggleTheme()}>
    <ThemeIcon theme={theme}/>
</button>
