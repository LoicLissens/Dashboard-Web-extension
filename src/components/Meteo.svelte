<script lang="ts">
    import axios from "axios";
    import { onMount } from "svelte";
    import {
        setMeteoCacheToStorage,
        getMeteoCacheFromStorage,
    } from "../helpers/manageStorage";
    import Tooltip from "./utils/Tooltip.svelte";
    import QuestionMarkIcon from "./icons/QuestionMarkIcon.svelte";
    import { addNotification, NotificationStatus } from "../store/store";

    let currTemp: number;
    let currUnit: number;
    let todayMaxTemp: number;
    let todayMinTemp: number;
    let todayUnit: string;
    let isUpdatingMeteoData: boolean = false;

    $: max = todayMaxTemp + todayUnit;
    $: min = todayMinTemp + todayUnit;
    $: curr = currTemp + currUnit;

    async function retrieveCachedMeteoData(): Promise<boolean> {
        const cachedDataLifetime = 3600000 * 6; // 6 hours
        const cachedData = await getMeteoCacheFromStorage();
        let useCachedData = false;

        if (cachedData) {
            currTemp = cachedData.currTemp;
            currUnit = cachedData.currUnit;
            todayMaxTemp = cachedData.todayMaxTemp;
            todayMinTemp = cachedData.todayMinTemp;
            todayUnit = cachedData.todayUnit;
            // Still populate even if cached data are outdated as getCurrentPosition can take a while, when data are retrieved it will be updated
            useCachedData =
                cachedData.createdAt + cachedDataLifetime > Date.now();
        }
        return useCachedData;
    }
    async function retrieveMeteodataWithGeolocation(): Promise<void> {
        isUpdatingMeteoData = true;
        const options = {
            enableHighAccuracy: false,
            timeout: Infinity, // No timeout
            maximumAge: 0, // No cache
        };
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${tz}&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min&forecast_days=1`;
                axios.get(url).then((r) => {
                    let data = r.data;
                    currTemp = data.current.temperature_2m;
                    currUnit = data.current_units.temperature_2m;
                    todayMaxTemp = data.daily.temperature_2m_max[0];
                    todayMinTemp = data.daily.temperature_2m_min[0];
                    todayUnit = data.daily_units.temperature_2m_max;

                    setMeteoCacheToStorage({
                        createdAt: Date.now(),
                        currTemp: currTemp,
                        currUnit: currUnit,
                        todayMaxTemp: todayMaxTemp,
                        todayMinTemp: todayMinTemp,
                        todayUnit: todayUnit,
                    }).then(() => {
                        isUpdatingMeteoData = false;
                        addNotification("Meteo data updated", NotificationStatus.Success);
                    });
                });
            },
            () => addNotification("Couldn't retrieve geolocation data, unable to get meteo data",NotificationStatus.Error),
            options,
        );
    }
    async function getMeteoData() {
        const useCachedData = await retrieveCachedMeteoData();
        if (useCachedData) {
            return;
        }
        if (navigator.geolocation) {
            await retrieveMeteodataWithGeolocation();
        } else {
            addNotification("Geolocation is not supported by this browser.",NotificationStatus.Error);
        }
    }

    onMount(() => {
        getMeteoData();
    });
</script>

<div class={!currTemp && "is-skeleton"}>
    <span>{curr}</span>
    <span>
        <span class="icon">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke={currTemp ? "#E84545" : "currentColor"}
                width="1rem"
                height="1rem"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                />
            </svg>
        </span>
        <span>{max}</span>
    </span>
    <span>
        <span class="icon">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke={currTemp ? "#256fff" : "currentColor"}
                width="1rem"
                height="1rem"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                />
            </svg>
        </span>
        <span>{min}</span>
    </span>
    {#if isUpdatingMeteoData && currTemp}
        <div class="spinner is-inline-block ml-1"></div>
        <Tooltip
            tooltipText="Meteo data are outdated, udate is ongoing"
            position="bottom"><QuestionMarkIcon /></Tooltip
        >
    {/if}
</div>

<style>
    .spinner {
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid hsl(0, 0%, 71%);
        border-radius: 50%;
        width: 24px;
        height: 24px;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
