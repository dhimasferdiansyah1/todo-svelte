import { writable } from 'svelte/store';

export const toastMessage = writable<string | null>(null);

export function showToast(message: string) {
	toastMessage.set(message);
	setTimeout(() => {
		toastMessage.set(null);
	}, 3000); // Hide after 3 seconds
}
