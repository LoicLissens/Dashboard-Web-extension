<script>
    import axios from "axios";
    import { onMount } from "svelte";
    // import { getWeather } from '../api/weather';

    let currTemp;
    let currUnit;
    let todayMaxTemp;
    let todayMinTemp;
    let todayUnit;
    $: max = todayMaxTemp + todayUnit;
    $: min = todayMinTemp + todayUnit;
    $: curr = currTemp + currUnit;

    onMount(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${tz}&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min&forecast_days=1`;
                axios.get(url).then((r) => { //TODO Cash the meteo do avoir fetching all the time
                    let data = r.data;
                    currTemp = data.current.temperature_2m;
                    currUnit = data.current_units.temperature_2m;
                    todayMaxTemp = data.daily.temperature_2m_max[0];
                    todayMinTemp = data.daily.temperature_2m_min[0];
                    todayUnit = data.daily_units.temperature_2m_max;
                });
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    });
</script>

<div class={!currTemp && "is-skeleton"}>
    <span>{curr}</span>
    <span>{max}</span>
    <span>{min}</span>
</div>
