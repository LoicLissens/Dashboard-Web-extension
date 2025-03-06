import { readable, writable } from 'svelte/store';
export const date = readable(Date.now(), function start(set) {
    const interval = setInterval(() => {
		set(Date.now());
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
})

export const notifications = writable([]);

export function addNotification(notification) {
  notifications.update(n => [...n, { id: Date.now(),  ...notification }]);
}
export function removeNotification(id) {
  notifications.update(n => n.filter(notification => notification.id !== id));
}