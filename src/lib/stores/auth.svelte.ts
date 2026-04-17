import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '$lib/firebase';

function createAuthStore() {
	let user = $state<User | null>(null);
	let loading = $state(true);

	onAuthStateChanged(auth, (u) => {
		user = u;
		loading = false;
	});

	return {
		get user() { return user; },
		get loading() { return loading; }
	};
}

export const authStore = createAuthStore();
