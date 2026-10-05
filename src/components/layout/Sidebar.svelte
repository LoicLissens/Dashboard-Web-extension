<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Page } from "../../helpers/manageStorage";
  import { IconSize } from "../icons/BaseIcon.svelte";
  import Divider from "../utils/Divider.svelte";
  import HomeIcon from "../icons/HomeIcon.svelte";
  import VideoIcon from "../icons/VideoIcon.svelte";
  import ToolIcon from "../icons/ToolIcon.svelte";

  export let currentPage: Page;
  const dispatch = createEventDispatcher<{ changePage: Page }>();
</script>

<aside
  class="fixed left-[1%] top-[15vh] flex flex-col items-center bg-base-100 rounded-box shadow-md p-2"
>
  <nav class="w-full">
    <Divider />
    <ul class="menu menu-vertical gap-2 p-0">
      <li>
        <button
          class:menu-active={currentPage === Page.HOME}
          aria-current={currentPage === Page.HOME ? "page" : undefined}
          on:click={() => dispatch("changePage", Page.HOME)}
        >
          <HomeIcon
            isFocused={currentPage === Page.HOME}
            size={IconSize.Medium}
          />
        </button>
      </li>
      <li>
        <button
          class:menu-active={currentPage === Page.VIDEOS}
          aria-current={currentPage === Page.VIDEOS ? "page" : undefined}
          on:click={() => dispatch("changePage", Page.VIDEOS)}
        >
          <VideoIcon
            isFocused={currentPage === Page.VIDEOS}
            size={IconSize.Medium}
          />
        </button>
      </li>
      <li>
        <button
          class:menu-active={currentPage === Page.TOOL}
          aria-current={currentPage === Page.TOOL ? "page" : undefined}
          aria-label="Tools"
          on:click={() => dispatch("changePage", Page.TOOL)}
        >
          <ToolIcon
            isFocused={currentPage === Page.TOOL}
            size={IconSize.Medium}
          />
        </button>
      </li>
    </ul>
    <Divider />
  </nav>
</aside>
