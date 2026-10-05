<script lang="ts">
  import { fade } from "svelte/transition";
  import Colors from "../components/Colors.svelte";
  import Expander from "../components/utils/Expander.svelte";
</script>

<section class="w-[70%] mx-auto" in:fade|global>
  <Expander expanded={true} title="Colors">
    <Colors />
  </Expander>
</section>
