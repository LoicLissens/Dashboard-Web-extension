<script>
  import { fade} from 'svelte/transition';
  import Todo from "../components/Todo.svelte";
  import Colors from "../components/Colors.svelte";
  import Greetings from "../components/Greetings.svelte";
</script>

<section in:fade>
  <Greetings />
  <Todo />
  <Colors />
</section>

<style>
  section {
    width: 70%;
    margin: auto;
  }
</style>
