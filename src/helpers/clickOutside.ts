import type { ActionReturn } from 'svelte/action';

interface ClickOutsideAttributes {
    'on:click_outside': (event: CustomEvent<void>) => void;
}

export function clickOutside(node: HTMLElement): ActionReturn<undefined, ClickOutsideAttributes> {
    const handleClick = (event: MouseEvent) => {
        if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
            node.dispatchEvent(new CustomEvent('click_outside'))
        }
    }

    document.addEventListener('click', handleClick, true);

    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    }
}
