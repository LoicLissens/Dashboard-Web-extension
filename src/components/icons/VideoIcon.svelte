<script lang="ts">
    import BaseIcon from "./BaseIcon.svelte";
    import { type IconSize } from "./BaseIcon.svelte";
    export let size: IconSize;
    export let isFocused: boolean;
    $: strokeColor = isFocused ? "hsl(171, 100%, 41%)" : "currentColor";
</script>

<BaseIcon {size} scaleOnHover={true}>
    <svg fill={strokeColor} viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"
        ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
        ></g><g id="SVGRepo_iconCarrier"
            ><path
                d="M12.855 10.064c-.505.163-.855.68-.855 1.248v7.374c0 .574.354 1.094.86 1.254.51.16 1.083-.004 1.576-.407l3.562-2.918c.585-.48 1-.992 1.002-1.615.002-.623-.415-1.145-1.006-1.62-.63-.506-2.37-1.943-3.558-2.917-.497-.407-1.075-.562-1.58-.4zm.948 1.176c1.186.97 2.917 2.4 3.564 2.92.485.39.634.668.633.84 0 .172-.155.445-.637.84l-3.56 2.918c-.44.44-.803.183-.803-.072v-7.374c0-.543.476-.4.803-.072zM1.5 4C.678 4 0 4.678 0 5.5v19c0 .822.678 1.5 1.5 1.5h27c.822 0 1.5-.678 1.5-1.5v-19c0-.822-.678-1.5-1.5-1.5h-27zm0 1h27c.286 0 .5.214.5.5v19c0 .286-.214.5-.5.5h-27c-.286 0-.5-.214-.5-.5v-19c0-.286.214-.5.5-.5z"
            ></path></g
        ></svg
    >
</BaseIcon>
