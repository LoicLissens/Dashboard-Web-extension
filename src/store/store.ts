import { readable, writable, type Writable } from 'svelte/store';

export enum NotificationStatus{
	Success="success",
	Error="error",
	Warning="warning",
	Info="info"
}
export interface Notification{
	status:NotificationStatus,
	id:number,
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

export function addNotification(message:string, status:NotificationStatus): void {
  notifications.update(n => [...n, { id: Date.now(), status, message }]);
}
export function removeNotification(id:number): void {
  notifications.update(n => n.filter(notification => notification.id !== id));
}