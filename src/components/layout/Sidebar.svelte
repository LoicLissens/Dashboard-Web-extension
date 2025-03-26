<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Page } from "../../helpers/manageStorage";
  import { IconSize } from "../icons/BaseIcon.svelte";
  import Divider from "../utils/Divider.svelte";
  import HomeIcon from "../icons/HomeIcon.svelte";
  import VideoIcon from "../icons/VideoIcon.svelte";
  import Home from "../../views/Home.svelte";

  export let currentPage: Page;
  const dispatch = createEventDispatcher();
</script>

<aside class="box is-flex is-justify-content-center is-align-items-center box">
  <nav>
    <Divider />
    <ul>
      <li>
        <button on:click={() => dispatch("changePage", Page.HOME)}>
         <HomeIcon isFocused={currentPage == Page.HOME} size={IconSize.Medium} />
        </button>
      </li>
      <li>
        <button on:click={() => dispatch("changePage", Page.VIDEOS)}>
          <VideoIcon isFocused={currentPage == Page.VIDEOS} size={IconSize.Medium} />
        </button>
      </li>
    </ul>
    <Divider />
  </nav>
</aside>

<style>
  aside {
    position: fixed;
    left: 1%;
    top: 15vh;
    border-radius: 5px;
    height: 70vh;
  }
  li {
    cursor: pointer;
    list-style: none;
    padding-left: 0;
  }
</style>
