<script lang="ts">
  import {fade} from 'svelte/transition';
  import Todo from "../components/Todo.svelte";
  import Colors from "../components/Colors.svelte";
  import Expander from '../components/utils/Expander.svelte';
</script>

<section class="w-[70%] mx-auto" in:fade|global>
  <Expander title="Task">
    <Todo />
  </Expander>
  <Expander expanded={true} title="Colors Widget">
    <Colors />
  </Expander>
</section>
