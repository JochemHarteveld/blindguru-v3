<script lang="ts">
	import { signOut } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';
	import { authStore } from '$lib/stores/auth.svelte';

	let { children } = $props();

	$effect(() => {
		if (!authStore.loading && !authStore.user) {
			goto('/login');
		}
	});

	async function logout() {
		await signOut(auth);
		await goto('/');
	}

	const displayName = $derived(authStore.user?.displayName || authStore.user?.email || '');
	const initials = $derived(
		displayName
			.split(' ')
			.map((w) => w[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	);
</script>

{#if authStore.loading || !authStore.user}
	<div class="flex min-h-screen items-center justify-center bg-bg-base">
		<div class="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent-400"></div>
	</div>
{:else}
	<div class="min-h-screen bg-bg-base text-primary">
		<nav class="fixed top-0 z-50 w-full border-b border-border-subtle bg-bg-base/90 backdrop-blur-sm">
			<div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
				<a href="/clubs" class="flex items-center gap-2">
					<svg class="h-5 w-5 text-accent-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M12 2C9 6 4 8 4 12a4 4 0 0 0 6.5 3.1C10 17 9 19 8 20h8c-1-1-2-3-2.5-4.9A4 4 0 0 0 20 12c0-4-5-6-8-10Z"/>
					</svg>
					<span class="text-lg font-bold tracking-tight text-primary">PokerClock</span>
				</a>

				<div class="flex items-center gap-3">
					<a href="/invites" class="text-sm font-medium text-secondary transition-colors hover:text-primary">
						Invites
					</a>
					<div class="flex items-center gap-2">
						<div class="flex h-7 w-7 items-center justify-center rounded-full bg-accent-gradient text-xs font-black text-text-inverse">
							{initials || '?'}
						</div>
						<span class="hidden text-sm font-medium text-secondary sm:block">{displayName}</span>
					</div>
					<button
						onclick={logout}
						class="rounded-lg border border-border px-3 py-1.5 text-sm text-secondary transition-colors hover:border-accent-600/50 hover:text-primary"
					>
						Sign out
					</button>
				</div>
			</div>
		</nav>

		<div class="pt-14">
			{@render children()}
		</div>
	</div>
{/if}
