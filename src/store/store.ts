import { readable, Writable, writable } from 'svelte/store';

export enum NotificationStatus{
	Success="success",
	Error="error",
	Warning="warning",
	Info="info"
}
export interface Notification{
	status:NotificationStatus,
	id:Date,
	message:string
}

export const date = readable(Date.now(), function start(set) {
    const interval = setInterval(() => {
		set(Date.now());
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
})

export const notifications:Writable<Notification[]> = writable([]);

export function addNotification(notification:Notification): void {
	// @ts-ignore
  notifications.update(n => [...n, { id: Date.now(),  ...notification }]);
}
export function removeNotification(id:Date): void {
  notifications.update(n => n.filter(notification => notification.id !== id));
}