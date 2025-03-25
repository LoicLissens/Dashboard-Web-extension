<script lang="ts">
  import { type Channels, type Category } from "../../helpers/manageStorage";

  import VideoPlayer from "./VideoPlayer.svelte";
  import Expander from "../utils/Expander.svelte"

  export let channels: Channels;
  export let category: Category;
  let expanded = false;
</script>

<Expander title={category} expanded={expanded}>
  {#each channels as channel}
    <VideoPlayer {channel} />
  {/each}
</Expander>
