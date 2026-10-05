<script lang="ts">
    import { date } from "../store/store";
    import { pomodoro } from "../store/pomodoro";
    import {
        IDLE_STATE,
        SESSIONS_PER_CYCLE,
        finishPhase,
        startSession,
        type PomodoroState,
    } from "../helpers/pomodoro";
    import { applyPomodoroState } from "../services/pomodoro";
    import BaseIcon from "./icons/BaseIcon.svelte";

    $: running = $pomodoro.phase !== "idle";
    $: remainingSeconds =
        $pomodoro.endsAt === null
            ? 0
            : Math.max(0, Math.ceil(($pomodoro.endsAt - $date) / 1000));
    $: countdown = `${Math.floor(remainingSeconds / 60)}:${String(remainingSeconds % 60).padStart(2, "0")}`;
    $: session =
        $pomodoro.phase === "work"
            ? $pomodoro.completedSessions + 1
            : $pomodoro.completedSessions;

    async function run(next: PomodoroState) {
        (document.activeElement as HTMLElement | null)?.blur();
        await applyPomodoroState(next);
    }
</script>

<div class="dropdown dropdown-end">
    <div
        tabindex="0"
        role="button"
        class="btn btn-ghost {running ? 'gap-2 font-normal' : 'btn-circle'}"
        aria-label="Pomodoro timer"
    >
        {#if running}
            <span
                class="size-2 rounded-full {$pomodoro.phase === 'work'
                    ? 'bg-primary'
                    : 'bg-success'}"
            ></span>
            <span class="tabular-nums">{countdown}</span>
            <span class="text-xs text-base-content/50">{session}/{SESSIONS_PER_CYCLE}</span>
        {:else}
            <BaseIcon>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                </svg>
            </BaseIcon>
        {/if}
    </div>
    <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-40 w-44 p-2 shadow-sm">
        {#if !running}
            <li><button on:click={() => run(startSession($pomodoro, Date.now()))}>Start focus</button></li>
            {#if $pomodoro.completedSessions > 0}
                <li><button on:click={() => run(IDLE_STATE)}>Reset cycle</button></li>
            {/if}
        {:else}
            <li>
                <button on:click={() => run(finishPhase($pomodoro, Date.now()))}>
                    {$pomodoro.phase === "work" ? "Take break now" : "Skip break"}
                </button>
            </li>
            <li><button on:click={() => run(IDLE_STATE)}>Stop</button></li>
        {/if}
    </ul>
</div>
