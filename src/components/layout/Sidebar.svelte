<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Page } from "../../helpers/manageStorage";
  import Divider from "../utils/Divider.svelte";

  export let currentPage: Page;
  const dispatch = createEventDispatcher();
</script>

<aside class="box is-flex is-justify-content-center is-align-items-center">
  <nav>
    <Divider />
    <ul>
      <li>
        <button on:click={() => dispatch("changePage", Page.HOME)}>
          <span class="icon is-medium">
            <svg
              viewBox="0 -0.5 25 25"
              fill="None"
              xmlns="http://www.w3.org/2000/svg"
              ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g><g id="SVGRepo_iconCarrier">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18.867 15.8321L18.873 10.0391L14.75 5.92908C13.5057 4.69031 11.4942 4.69031 10.25 5.92908L6.13599 10.0291V15.8291C6.1393 17.5833 7.56377 19.0028 9.31799 19.0001H15.685C17.438 19.0029 18.862 17.5851 18.867 15.8321Z"
                  stroke="#A9A9A9"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M19.624 6.01807C19.624 5.60385 19.2882 5.26807 18.874 5.26807C18.4598 5.26807 18.124 5.60385 18.124 6.01807H19.624ZM18.874 10.0391H18.124C18.124 10.2384 18.2033 10.4295 18.3445 10.5702L18.874 10.0391ZM19.9705 12.1912C20.2638 12.4837 20.7387 12.4829 21.0311 12.1896C21.3236 11.8962 21.3229 11.4214 21.0295 11.1289L19.9705 12.1912ZM6.66552 10.5602C6.95886 10.2678 6.95959 9.79289 6.66714 9.49955C6.3747 9.20621 5.89982 9.20548 5.60648 9.49793L6.66552 10.5602ZM3.97048 11.1289C3.67714 11.4214 3.67641 11.8962 3.96886 12.1896C4.2613 12.4829 4.73618 12.4837 5.02952 12.1912L3.97048 11.1289ZM13.75 19.0001C13.75 19.4143 14.0858 19.7501 14.5 19.7501C14.9142 19.7501 15.25 19.4143 15.25 19.0001H13.75ZM9.75 19.0001C9.75 19.4143 10.0858 19.7501 10.5 19.7501C10.9142 19.7501 11.25 19.4143 11.25 19.0001H9.75ZM18.124 6.01807V10.0391H19.624V6.01807H18.124ZM18.3445 10.5702L19.9705 12.1912L21.0295 11.1289L19.4035 9.50792L18.3445 10.5702ZM5.60648 9.49793L3.97048 11.1289L5.02952 12.1912L6.66552 10.5602L5.60648 9.49793ZM15.25 19.0001V17.2201H13.75V19.0001H15.25ZM15.25 17.2201C15.25 15.7013 14.0188 14.4701 12.5 14.4701V15.9701C13.1904 15.9701 13.75 16.5297 13.75 17.2201H15.25ZM12.5 14.4701C10.9812 14.4701 9.75 15.7013 9.75 17.2201H11.25C11.25 16.5297 11.8096 15.9701 12.5 15.9701V14.4701ZM9.75 17.2201V19.0001H11.25V17.2201H9.75Z"
                  fill="#A9A9A9"
                ></path>
              </g></svg
            >
          </span>
        </button>
      </li>
      <li>
        <button on:click={() => dispatch("changePage", Page.VIDEOS)}>
          <span class="icon is-medium">
            <svg fill="#A9A9A9" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12.855 10.064c-.505.163-.855.68-.855 1.248v7.374c0 .574.354 1.094.86 1.254.51.16 1.083-.004 1.576-.407l3.562-2.918c.585-.48 1-.992 1.002-1.615.002-.623-.415-1.145-1.006-1.62-.63-.506-2.37-1.943-3.558-2.917-.497-.407-1.075-.562-1.58-.4zm.948 1.176c1.186.97 2.917 2.4 3.564 2.92.485.39.634.668.633.84 0 .172-.155.445-.637.84l-3.56 2.918c-.44.44-.803.183-.803-.072v-7.374c0-.543.476-.4.803-.072zM1.5 4C.678 4 0 4.678 0 5.5v19c0 .822.678 1.5 1.5 1.5h27c.822 0 1.5-.678 1.5-1.5v-19c0-.822-.678-1.5-1.5-1.5h-27zm0 1h27c.286 0 .5.214.5.5v19c0 .286-.214.5-.5.5h-27c-.286 0-.5-.214-.5-.5v-19c0-.286.214-.5.5-.5z"></path></g></svg>
          </span>
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
    border: 2px solid #D3D3D3;
    border-radius: 5px;
    height: 70vh;
  }
  li {
    cursor: pointer;
    list-style: none;
    padding-left: 0;
  }
</style>
