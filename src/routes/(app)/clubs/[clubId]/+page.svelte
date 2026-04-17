<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { doc, collection, onSnapshot, type Timestamp } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { authStore } from '$lib/stores/auth.svelte';

	type ClubDoc = {
		id: string;
		name: string;
		adminUid: string;
		createdAt: Timestamp;
		members: Record<string, { role: 'admin' | 'member'; joinedAt: Timestamp }>;
	};

	type BlindStructure = {
		id: string;
		name: string;
		levels: { type: string }[];
	};

	type Player = {
		id: string;
		name: string;
		avatarUrl?: string;
	};

	type Game = {
		id: string;
		name: string;
		date: Timestamp;
		startTime: string;
		status: 'draft' | 'scheduled' | 'live' | 'finished';
	};

	const clubId = page.params.clubId!;

	let club = $state<ClubDoc | null>(null);
	let structures = $state<BlindStructure[]>([]);
	let players = $state<Player[]>([]);
	let games = $state<Game[]>([]);
	let fetching = $state(true);

	const unsubs: (() => void)[] = [];

	const myRole = $derived(
		club && authStore.user ? (club.members[authStore.user.uid]?.role ?? null) : null
	);
	const isAdmin = $derived(myRole === 'admin');
	const memberCount = $derived(club ? Object.keys(club.members).length : 0);
	const liveGame = $derived(games.find((g) => g.status === 'live') ?? null);
	const upcomingGames = $derived(
		games
			.filter((g) => g.status === 'draft' || g.status === 'scheduled')
			.sort((a, b) => a.date.seconds - b.date.seconds)
			.slice(0, 3)
	);
	const upcomingCount = $derived(
		games.filter((g) => g.status === 'draft' || g.status === 'scheduled').length
	);

	function initials(name: string) {
		return name
			.split(' ')
			.map((w) => w[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	function formatDate(ts: Timestamp, time: string) {
		return (
			ts.toDate().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) +
			' · ' +
			time
		);
	}

	onMount(() => {
		const uid = authStore.user?.uid;
		if (!uid) return;

		unsubs.push(
			onSnapshot(doc(db, 'clubs', clubId), (snap) => {
				if (!snap.exists()) {
					goto('/clubs');
					return;
				}
				const data = { id: snap.id, ...snap.data() } as ClubDoc;
				if (!data.members[uid]) {
					goto('/clubs');
					return;
				}
				club = data;
				fetching = false;
			})
		);

		unsubs.push(
			onSnapshot(collection(db, 'clubs', clubId, 'blindStructures'), (snap) => {
				structures = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as BlindStructure);
			})
		);

		unsubs.push(
			onSnapshot(collection(db, 'clubs', clubId, 'players'), (snap) => {
				players = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Player);
			})
		);

		unsubs.push(
			onSnapshot(collection(db, 'clubs', clubId, 'games'), (snap) => {
				games = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Game);
			})
		);
	});

	onDestroy(() => unsubs.forEach((u) => u()));
</script>

<svelte:head><title>{club?.name ?? 'Club'} · PokerClock</title></svelte:head>

<main class="mx-auto max-w-6xl px-4 py-10 sm:px-6">

	<!-- Header -->
	<div class="mb-8 flex items-start justify-between gap-4">
		<div class="flex items-start gap-4">
			<a href="/clubs" class="mt-1 text-muted transition-colors hover:text-primary" aria-label="Back to clubs">
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
				</svg>
			</a>
			<div>
				{#if fetching}
					<div class="h-8 w-48 animate-pulse rounded-lg bg-bg-raised"></div>
					<div class="mt-2 h-4 w-24 animate-pulse rounded bg-bg-raised"></div>
				{:else}
					<h1 class="text-2xl font-black text-primary sm:text-3xl">{club?.name}</h1>
					<div class="mt-1 flex items-center gap-2">
						<span class="text-sm text-secondary">{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
						{#if isAdmin}
							<span class="rounded-full bg-accent-gradient px-2 py-0.5 text-xs font-black text-text-inverse">Admin</span>
						{:else}
							<span class="rounded-full border border-border px-2 py-0.5 text-xs font-semibold text-secondary">Member</span>
						{/if}
					</div>
				{/if}
			</div>
		</div>
		{#if isAdmin}
			<a href="/clubs/{clubId}/settings" class="mt-1 text-muted transition-colors hover:text-primary" aria-label="Club settings">
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
				</svg>
			</a>
		{/if}
	</div>

	{#if !fetching}

		<!-- Stats row -->
		<div class="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
			{#each [
				{ label: 'Structures', value: structures.length },
				{ label: 'Players', value: players.length },
				{ label: 'Upcoming', value: upcomingCount },
				{ label: 'Total Games', value: games.length }
			] as stat (stat.label)}
				<div class="bg-surface-gradient rounded-xl border border-border p-4">
					<p class="text-xs font-medium text-muted">{stat.label}</p>
					<p class="mt-1 text-2xl font-black text-primary">{stat.value}</p>
				</div>
			{/each}
		</div>

		<!-- Games section -->
		<section class="mb-6">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-bold text-primary">Games</h2>
				<div class="flex items-center gap-3">
					<a href="/clubs/{clubId}/games" class="text-sm text-secondary transition-colors hover:text-primary">View all →</a>
					<a
						href="/clubs/{clubId}/games/new"
						class="bg-primary-gradient rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
					>
						+ New Game
					</a>
				</div>
			</div>

			{#if liveGame}
				<a
					href="/clubs/{clubId}/games/{liveGame.id}/clock"
					class="mb-3 flex items-center justify-between rounded-xl border border-accent-500/50 bg-surface-gradient p-4 transition-colors hover:border-accent-400/70"
				>
					<div class="flex items-center gap-3">
						<span class="relative flex h-2.5 w-2.5">
							<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75"></span>
							<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-400"></span>
						</span>
						<div>
							<p class="text-xs font-semibold uppercase tracking-wide text-accent-400">Live now</p>
							<p class="font-bold text-primary">{liveGame.name}</p>
						</div>
					</div>
					<svg class="h-4 w-4 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
					</svg>
				</a>
			{/if}

			{#if upcomingGames.length > 0}
				<div class="space-y-2">
					{#each upcomingGames as game (game.id)}
						<a
							href="/clubs/{clubId}/games/{game.id}"
							class="bg-surface-gradient group flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:border-accent-600/50"
						>
							<div>
								<p class="font-semibold text-primary">{game.name}</p>
								<p class="text-xs text-secondary">{formatDate(game.date, game.startTime)}</p>
							</div>
							<div class="flex items-center gap-3">
								<span class="rounded-full border border-border px-2 py-0.5 text-xs capitalize text-muted">{game.status}</span>
								<svg class="h-4 w-4 text-muted transition-colors group-hover:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
								</svg>
							</div>
						</a>
					{/each}
				</div>
			{:else if !liveGame}
				<div class="flex flex-col items-center justify-center rounded-xl border border-border py-12 text-center">
					<span class="mb-3 select-none text-5xl leading-none text-accent-500 opacity-20">♠</span>
					<p class="text-sm text-secondary">No games yet.</p>
					<a href="/clubs/{clubId}/games/new" class="mt-3 text-sm font-semibold text-primary transition-colors hover:text-accent-400">
						Schedule a game →
					</a>
				</div>
			{/if}
		</section>

		<!-- Structures + Players row -->
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">

			<!-- Blind Structures -->
			<section class="bg-surface-gradient rounded-xl border border-border p-5">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="font-bold text-primary">Blind Structures</h2>
					{#if isAdmin}
						<a href="/clubs/{clubId}/structures/new" class="text-xs font-semibold text-primary transition-colors hover:text-accent-400">+ New</a>
					{/if}
				</div>

				{#if structures.length === 0}
					<p class="text-sm text-muted">No structures yet.</p>
					{#if isAdmin}
						<a href="/clubs/{clubId}/structures/new" class="mt-2 inline-block text-sm font-semibold text-primary transition-colors hover:text-accent-400">
							Create first structure →
						</a>
					{/if}
				{:else}
					<ul class="space-y-1">
						{#each structures.slice(0, 4) as s (s.id)}
							<li>
								<a
									href="/clubs/{clubId}/structures/{s.id}"
									class="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-bg-raised"
								>
									<span class="text-sm font-medium text-primary">{s.name}</span>
									<span class="text-xs text-muted">{s.levels.length} {s.levels.length === 1 ? 'level' : 'levels'}</span>
								</a>
							</li>
						{/each}
					</ul>
					{#if structures.length > 4}
						<p class="mt-2 px-3 text-xs text-muted">+{structures.length - 4} more</p>
					{/if}
				{/if}
			</section>

			<!-- Players -->
			<section class="bg-surface-gradient rounded-xl border border-border p-5">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="font-bold text-primary">
						Players <span class="ml-1 text-sm font-normal text-muted">({players.length})</span>
					</h2>
					<a href="/clubs/{clubId}/players" class="text-xs font-semibold text-secondary transition-colors hover:text-primary">Manage →</a>
				</div>

				{#if players.length === 0}
					<p class="text-sm text-muted">No players yet.</p>
					<a href="/clubs/{clubId}/players/new" class="mt-2 inline-block text-sm font-semibold text-primary transition-colors hover:text-accent-400">
						Add first player →
					</a>
				{:else}
					<div class="flex flex-wrap gap-2">
						{#each players.slice(0, 8) as player (player.id)}
							{#if player.avatarUrl}
								<img
									src={player.avatarUrl}
									alt={player.name}
									title={player.name}
									class="h-10 w-10 rounded-full border border-border object-cover"
								/>
							{:else}
								<div
									title={player.name}
									class="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-raised text-xs font-bold text-secondary"
								>
									{initials(player.name)}
								</div>
							{/if}
						{/each}
						{#if players.length > 8}
							<div class="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-raised text-xs font-bold text-muted">
								+{players.length - 8}
							</div>
						{/if}
					</div>
				{/if}
			</section>

		</div>

	{/if}

</main>
