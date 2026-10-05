<script lang="ts">
  import {fade} from 'svelte/transition';
  import Todo from "../components/Todo.svelte";
  import Calendar from "../components/Calendar.svelte";
  import Expander from '../components/utils/Expander.svelte';
  import { eventsTodayCount } from "../store/calendar";
</script>

<section class="w-[70%] mx-auto" in:fade|global>
  <Expander expanded={true} title="Task">
    <Todo />
  </Expander>
  <Expander title="Agenda" badge={$eventsTodayCount}>
    <Calendar />
  </Expander>
</section>
