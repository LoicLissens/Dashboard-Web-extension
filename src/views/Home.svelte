<script lang="ts">
  import { fade} from 'svelte/transition';
  import Todo from "../components/Todo.svelte";
  import Colors from "../components/Colors.svelte";
</script>

<section in:fade>
  <Todo />
  <Colors />
</section>

<style>
  section {
    width: 70%;
    margin: 0 auto;
  }
</style>
