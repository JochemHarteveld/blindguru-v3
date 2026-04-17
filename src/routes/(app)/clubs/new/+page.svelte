<script lang="ts">
	import { goto } from '$app/navigation';
	import { db } from '$lib/firebase';
	import { authStore } from '$lib/stores/auth.svelte';
	import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

	let name = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const trimmed = name.trim();
		if (trimmed.length < 2) {
			error = 'Club name must be at least 2 characters.';
			return;
		}
		const uid = authStore.user?.uid;
		if (!uid) return;

		error = '';
		loading = true;
		try {
			await addDoc(collection(db, 'clubs'), {
				name: trimmed,
				adminUid: uid,
				createdAt: serverTimestamp(),
				members: {
					[uid]: {
					role: 'admin',
					joinedAt: serverTimestamp(),
					displayName: authStore.user?.displayName || '',
					email: authStore.user?.email || ''
				}
				}
			});
			await goto('/clubs');
		} catch (err: unknown) {
			error = err instanceof Error ? err.message : 'Something went wrong.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-16">
	<div class="w-full max-w-sm">
		<!-- Back link — above card, left-aligned -->
		<a
			href="/clubs"
			class="mb-5 inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted transition-colors hover:text-secondary"
		>
			<svg
				class="h-4 w-4"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M15 19l-7-7 7-7" />
			</svg>
			Back to clubs
		</a>

		<!-- Card -->
		<div class="rounded-2xl border border-border bg-bg-surface shadow-2xl">
			<!-- Header -->
			<div class="px-8 pb-6 pt-8 text-center">
				<div
					class="bg-accent-gradient mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
					aria-hidden="true"
				>
					<svg class="h-7 w-7 text-text-inverse" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M12 2C9.5 5.5 5 7 5 11a4 4 0 0 0 5.5 3.7c-.3 1.5-1 3-2 4.3h7c-1-1.3-1.7-2.8-2-4.3A4 4 0 0 0 19 11c0-4-4.5-5.5-7-9Z"
						/>
					</svg>
				</div>
				<h1 class="text-xl font-bold tracking-tight text-primary">Create a Club</h1>
				<p class="mt-1.5 text-sm leading-relaxed text-muted">
					Give your club a name to get started.<br />You can invite members later.
</p>
			</div>

			<div class="mx-8 h-px bg-border-subtle"></div>

			<!-- Form -->
			<div class="px-8 pb-8 pt-6">
				<form onsubmit={handleSubmit} class="flex flex-col gap-5">
					<div class="flex flex-col gap-2">
						<label for="club-name" class="text-xs font-semibold uppercase tracking-wider text-secondary">
							Club name <span class="text-danger-400" aria-label="required">*</span>
						</label>
						<input
							id="club-name"
							type="text"
							bind:value={name}
							placeholder="e.g. Friday Night Poker"
							autocomplete="off"
							disabled={loading}
							class="w-full rounded-xl border border-border bg-bg-raised px-4 py-3 text-sm text-primary placeholder:text-muted focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>

					{#if error}
						<p
							role="alert"
							class="rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-400"
						>
							{error}
						</p>
					{/if}

					<div class="flex flex-col gap-3 pt-1">
						<button
							type="submit"
							disabled={loading}
							class="bg-primary-gradient flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{#if loading}
								<svg
									class="h-4 w-4 animate-spin"
									viewBox="0 0 24 24"
									fill="none"
									aria-hidden="true"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									/>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8v8H4z"
									/>
								</svg>
								Creating…
							{:else}
								Create Club
							{/if}
						</button>
						<a
							href="/clubs"
							class="flex w-full cursor-pointer items-center justify-center rounded-xl border border-border py-3 text-sm font-medium text-secondary transition-colors hover:border-accent-600/30 hover:text-primary"
						>
							Cancel
						</a>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
