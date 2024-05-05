<script>
    import Greetings from "../Greetings.svelte";
    import Theme from "../Theme.svelte";
    import Meteo from "../Meteo.svelte";
    import Settings from "../settings/Settings.svelte";
</script>

<nav class="navbar">
    <div class="navbar-brand">
        <Greetings />
    </div>
    <div class="navbar-item">
        <Meteo />
    </div>
    <div class="navbar-end">
        <div class="navbar-item">
            <Settings/>
        </div>
        <div class="navbar-item">
            <Theme />
        </div>
    </div>
</nav>

