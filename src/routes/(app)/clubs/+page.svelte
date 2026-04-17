<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { collection, query, where, onSnapshot, type Timestamp } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { authStore } from '$lib/stores/auth.svelte';

	type ClubDoc = {
		id: string;
		name: string;
		adminUid: string;
		createdAt: Timestamp;
		members: Record<string, { role: 'admin' | 'member'; joinedAt: Timestamp }>;
	};

	let clubs = $state<ClubDoc[]>([]);
	let fetching = $state(true);
	let unsubscribe: (() => void) | null = null;

	onMount(() => {
		const uid = authStore.user?.uid;
		if (!uid) return;

		const q = query(
			collection(db, 'clubs'),
			where(`members.${uid}.role`, 'in', ['admin', 'member'])
		);

		unsubscribe = onSnapshot(q, (snap) => {
			clubs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ClubDoc);
			fetching = false;
		});
	});

	onDestroy(() => unsubscribe?.());

	function memberCount(club: ClubDoc) {
		return Object.keys(club.members).length;
	}

	function myRole(club: ClubDoc): 'admin' | 'member' {
		return club.members[authStore.user!.uid]?.role ?? 'member';
	}
</script>

<svelte:head><title>Your Clubs · PokerClock</title></svelte:head>

<main class="mx-auto max-w-6xl px-4 py-10 sm:px-6">

	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-black text-primary sm:text-3xl">Your Clubs</h1>
			<p class="mt-1 text-sm text-secondary">Manage your poker groups and games.</p>
		</div>
		<a
			href="/clubs/new"
			class="bg-primary-gradient flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
		>
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
			</svg>
			New Club
		</a>
	</div>

	{#if fetching}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each [1, 2, 3] as _}
				<div class="h-32 animate-pulse rounded-xl border border-border bg-bg-raised"></div>
			{/each}
		</div>

	{:else if clubs.length === 0}
		<div class="flex flex-col items-center justify-center py-24 text-center">
			<span class="mb-4 select-none text-7xl leading-none opacity-20 text-accent-500">♠</span>
			<h2 class="mb-2 text-lg font-bold text-primary">No clubs yet</h2>
			<p class="mb-6 max-w-xs text-sm text-secondary">Create your first club to start managing games, players, and blind structures.</p>
			<a
				href="/clubs/new"
				class="bg-primary-gradient rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
			>
				Create your first club →
			</a>
		</div>

	{:else}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each clubs as club (club.id)}
				<a
					href="/clubs/{club.id}"
					class="bg-surface-gradient group relative flex flex-col gap-3 rounded-xl border border-border p-6 transition-colors hover:border-accent-600/50"
				>
					<div class="flex items-start justify-between gap-2">
						<h2 class="text-base font-bold leading-tight text-primary">{club.name}</h2>
						{#if myRole(club) === 'admin'}
							<span class="shrink-0 rounded-full bg-accent-gradient px-2 py-0.5 text-xs font-black text-text-inverse">
								Admin
							</span>
						{:else}
							<span class="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs font-semibold text-secondary">
								Member
							</span>
						{/if}
					</div>

					<p class="text-sm text-muted">
						{memberCount(club)} {memberCount(club) === 1 ? 'member' : 'members'}
					</p>

					<div class="mt-auto flex items-center justify-end text-muted transition-colors group-hover:text-accent-400">
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
						</svg>
					</div>
				</a>
			{/each}
		</div>
	{/if}

</main>
