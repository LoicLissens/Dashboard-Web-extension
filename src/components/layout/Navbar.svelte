<script lang="ts">
    import Greetings from "../Greetings.svelte";
    import Theme from "../Theme.svelte";
    import Meteo from "../Meteo.svelte";
    import Settings from "../settings/Settings.svelte";
</script>

<!-- daisyUI has no `navbar-item` and no fixed-position modifier, so the
     positioning is plain utilities. App.svelte pads `main` to match. -->
<nav class="navbar bg-base-100 shadow-sm fixed top-0 inset-x-0 z-30 min-h-16">
    <div class="navbar-start gap-2">
        <Greetings />
    </div>
    <div class="navbar-center">
        <Meteo />
    </div>
    <div class="navbar-end gap-2">
        <Settings />
        <Theme />
    </div>
</nav>

