<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		collectionGroup,
		query,
		where,
		onSnapshot,
		updateDoc,
		doc,
		serverTimestamp,
		type Timestamp,
		type DocumentReference
	} from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { authStore } from '$lib/stores/auth.svelte';

	type InviteDoc = {
		id: string;
		_ref: DocumentReference;
		email: string;
		invitedBy: string;
		invitedByName: string;
		clubName: string;
		clubId: string;
		status: string;
		createdAt: Timestamp;
	};

	let invites = $state<InviteDoc[]>([]);
	let fetching = $state(true);
	let acting = $state<Record<string, boolean>>({});

	let unsubscribe: (() => void) | null = null;

	async function accept(invite: InviteDoc) {
		const uid = authStore.user?.uid;
		if (!uid) return;
		acting = { ...acting, [invite.id]: true };
		try {
			await updateDoc(doc(db, 'clubs', invite.clubId), {
				[`members.${uid}`]: {
					role: 'member',
					joinedAt: serverTimestamp(),
					displayName: authStore.user?.displayName || '',
					email: authStore.user?.email || ''
				}
			});
			await updateDoc(invite._ref, { status: 'accepted' });
			await goto(`/clubs/${invite.clubId}`);
		} catch (e) {
			console.error(e);
			acting = { ...acting, [invite.id]: false };
		}
	}

	async function decline(invite: InviteDoc) {
		acting = { ...acting, [invite.id]: true };
		try {
			await updateDoc(invite._ref, { status: 'declined' });
		} catch (e) {
			console.error(e);
		} finally {
			acting = { ...acting, [invite.id]: false };
		}
	}

	onMount(() => {
		const email = authStore.user?.email;
		if (!email) return;

		const q = query(
			collectionGroup(db, 'invites'),
			where('email', '==', email.toLowerCase()),
			where('status', '==', 'pending')
		);

		unsubscribe = onSnapshot(q, (snap) => {
			invites = snap.docs.map((d) => ({ id: d.id, _ref: d.ref, ...d.data() }) as InviteDoc);
			fetching = false;
		});
	});

	onDestroy(() => unsubscribe?.());
</script>

<svelte:head><title>Invites · PokerClock</title></svelte:head>

<main class="mx-auto max-w-2xl px-4 py-10 sm:px-6">

	<div class="mb-8">
		<a
			href="/clubs"
			class="mb-5 inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted transition-colors hover:text-secondary"
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M15 19l-7-7 7-7" />
			</svg>
			My clubs
		</a>
		<h1 class="text-2xl font-black text-primary">Invites</h1>
		<p class="mt-1 text-sm text-secondary">Pending club invitations for {authStore.user?.email}</p>
	</div>

	{#if fetching}
		<div class="space-y-3">
			{#each [1, 2] as i (i)}
				<div class="h-24 animate-pulse rounded-xl border border-border bg-bg-raised"></div>
			{/each}
		</div>
	{:else if invites.length === 0}
		<div class="flex flex-col items-center justify-center rounded-xl border border-border py-16 text-center">
			<span class="mb-3 select-none text-5xl leading-none text-accent-500 opacity-20">✉</span>
			<p class="text-sm text-secondary">No pending invites.</p>
		</div>
	{:else}
		<ul class="space-y-3">
			{#each invites as invite (invite.id)}
				{@const busy = acting[invite.id] ?? false}
				<li class="bg-surface-gradient rounded-xl border border-border p-5">
					<div class="mb-4">
						<p class="font-bold text-primary">{invite.clubName}</p>
						<p class="mt-0.5 text-sm text-secondary">
							Invited by {invite.invitedByName || 'a club admin'}
						</p>
					</div>
					<div class="flex gap-2">
						<button
							onclick={() => accept(invite)}
							disabled={busy}
							class="bg-primary-gradient cursor-pointer rounded-xl px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{#if busy}
								<svg class="inline h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
								</svg>
								Joining…
							{:else}
								Accept
							{/if}
						</button>
						<button
							onclick={() => decline(invite)}
							disabled={busy}
							class="cursor-pointer rounded-xl border border-border px-4 py-2 text-sm font-medium text-secondary transition-colors hover:border-danger-500/40 hover:text-danger-400 disabled:opacity-50"
						>
							Decline
						</button>
					</div>
				</li>
			{/each}
		</ul>
	{/if}

</main>
