<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		doc,
		collection,
		onSnapshot,
		updateDoc,
		addDoc,
		deleteField,
		serverTimestamp,
		query,
		where,
		type Timestamp
	} from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { authStore } from '$lib/stores/auth.svelte';

	type MemberEntry = {
		role: 'admin' | 'member';
		joinedAt: Timestamp;
		displayName?: string;
		email?: string;
	};

	type ClubDoc = {
		id: string;
		name: string;
		adminUid: string;
		members: Record<string, MemberEntry>;
	};

	type InviteDoc = {
		id: string;
		email: string;
		invitedBy: string;
		invitedByName: string;
		status: string;
		createdAt: Timestamp;
	};

	const clubId = page.params.clubId!;

	let club = $state<ClubDoc | null>(null);
	let pendingInvites = $state<InviteDoc[]>([]);
	let fetching = $state(true);

	// General section
	let nameInput = $state('');
	let nameSaving = $state(false);
	let nameError = $state('');
	let nameSuccess = $state(false);

	// Invite section
	let inviteEmail = $state('');
	let inviteLoading = $state(false);
	let inviteError = $state('');
	let inviteSuccess = $state('');

	// Member removal
	let removingUid = $state<string | null>(null);
	let removeError = $state('');

	const unsubs: (() => void)[] = [];

	const sortedMembers = $derived(
		club
			? Object.entries(club.members).sort(([, a], [, b]) => {
					if (a.role === b.role) return 0;
					return a.role === 'admin' ? -1 : 1;
				})
			: []
	);

	const adminCount = $derived(
		club ? Object.values(club.members).filter((m) => m.role === 'admin').length : 0
	);

	function memberLabel(uid: string, entry: MemberEntry) {
		return entry.displayName || entry.email || uid.slice(0, 8);
	}

	function initials(label: string) {
		return label
			.split(/[\s@.]/)
			.filter(Boolean)
			.map((w) => w[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	async function saveName() {
		if (!club) return;
		const trimmed = nameInput.trim();
		if (trimmed.length < 2) {
			nameError = 'Club name must be at least 2 characters.';
			return;
		}
		if (trimmed === club.name) return;
		nameError = '';
		nameSuccess = false;
		nameSaving = true;
		try {
			await updateDoc(doc(db, 'clubs', clubId), { name: trimmed });
			nameSuccess = true;
			setTimeout(() => (nameSuccess = false), 2000);
		} catch (e) {
			nameError = e instanceof Error ? e.message : 'Failed to save.';
		} finally {
			nameSaving = false;
		}
	}

	async function removeMember(uid: string) {
		if (!club) return;
		const entry = club.members[uid];
		if (entry?.role === 'admin' && adminCount <= 1) {
			removeError = 'Cannot remove the last admin.';
			return;
		}
		removeError = '';
		removingUid = uid;
		try {
			await updateDoc(doc(db, 'clubs', clubId), {
				[`members.${uid}`]: deleteField()
			});
		} catch (e) {
			removeError = e instanceof Error ? e.message : 'Failed to remove member.';
		} finally {
			removingUid = null;
		}
	}

	async function sendInvite(e: SubmitEvent) {
		e.preventDefault();
		if (!club) return;
		const email = inviteEmail.trim().toLowerCase();
		if (!email || !email.includes('@')) {
			inviteError = 'Enter a valid email address.';
			return;
		}
		const alreadyPending = pendingInvites.some((i) => i.email === email);
		if (alreadyPending) {
			inviteError = 'Invite already sent to this email.';
			return;
		}
		inviteError = '';
		inviteSuccess = '';
		inviteLoading = true;
		try {
			await addDoc(collection(db, 'clubs', clubId, 'invites'), {
				email,
				invitedBy: authStore.user!.uid,
				invitedByName: authStore.user!.displayName || authStore.user!.email || '',
				clubName: club.name,
				clubId,
				createdAt: serverTimestamp(),
				status: 'pending'
			});
			inviteEmail = '';
			inviteSuccess = `Invite sent to ${email}.`;
			setTimeout(() => (inviteSuccess = ''), 3000);
		} catch (e) {
			inviteError = e instanceof Error ? e.message : 'Failed to send invite.';
		} finally {
			inviteLoading = false;
		}
	}

	async function cancelInvite(inviteId: string) {
		try {
			await updateDoc(doc(db, 'clubs', clubId, 'invites', inviteId), { status: 'cancelled' });
		} catch {
			// silently fail — real-time listener will reflect truth
		}
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
				if (data.members[uid].role !== 'admin') {
					goto(`/clubs/${clubId}`);
					return;
				}
				if (!club) nameInput = data.name;
				club = data;
				fetching = false;
			})
		);

		const inviteQ = query(
			collection(db, 'clubs', clubId, 'invites'),
			where('status', '==', 'pending')
		);
		unsubs.push(
			onSnapshot(inviteQ, (snap) => {
				pendingInvites = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as InviteDoc);
			})
		);
	});

	onDestroy(() => unsubs.forEach((u) => u()));
</script>

<svelte:head><title>Settings · {club?.name ?? 'Club'} · PokerClock</title></svelte:head>

<main class="mx-auto max-w-2xl px-4 py-10 sm:px-6">

	<!-- Header -->
	<div class="mb-8">
		<a
			href="/clubs/{clubId}"
			class="mb-5 inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted transition-colors hover:text-secondary"
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M15 19l-7-7 7-7" />
			</svg>
			{club?.name ?? 'Club'}
		</a>
		<h1 class="text-2xl font-black text-primary">Club Settings</h1>
	</div>

	{#if fetching}
		<div class="space-y-4">
			<div class="h-32 animate-pulse rounded-xl border border-border bg-bg-raised"></div>
			<div class="h-48 animate-pulse rounded-xl border border-border bg-bg-raised"></div>
			<div class="h-40 animate-pulse rounded-xl border border-border bg-bg-raised"></div>
		</div>
	{:else}

		<!-- General -->
		<section class="bg-surface-gradient mb-5 rounded-xl border border-border p-5">
			<h2 class="mb-4 font-bold text-primary">General</h2>
			<form onsubmit={(e) => { e.preventDefault(); saveName(); }} class="flex flex-col gap-3">
				<div class="flex flex-col gap-2">
					<label for="club-name" class="text-xs font-semibold uppercase tracking-wider text-secondary">
						Club name
					</label>
					<input
						id="club-name"
						type="text"
						bind:value={nameInput}
						disabled={nameSaving}
						class="w-full rounded-xl border border-border bg-bg-raised px-4 py-3 text-sm text-primary placeholder:text-muted focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</div>
				{#if nameError}
					<p role="alert" class="rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-400">{nameError}</p>
				{/if}
				{#if nameSuccess}
					<p class="rounded-xl border border-primary-500/30 bg-primary-500/10 px-4 py-3 text-sm text-primary-400">Saved.</p>
				{/if}
				<div class="flex justify-end">
					<button
						type="submit"
						disabled={nameSaving || nameInput.trim() === club?.name}
						class="bg-primary-gradient cursor-pointer rounded-xl px-5 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if nameSaving}
							<svg class="inline h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
							</svg>
							Saving…
						{:else}
							Save
						{/if}
					</button>
				</div>
			</form>
		</section>

		<!-- Members -->
		<section class="bg-surface-gradient mb-5 rounded-xl border border-border p-5">
			<h2 class="mb-4 font-bold text-primary">
				Members <span class="ml-1 text-sm font-normal text-muted">({sortedMembers.length})</span>
			</h2>

			{#if removeError}
				<p role="alert" class="mb-3 rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-400">{removeError}</p>
			{/if}

			<ul class="space-y-2">
				{#each sortedMembers as [uid, entry] (uid)}
					{@const label = memberLabel(uid, entry)}
					{@const isSelf = uid === authStore.user?.uid}
					{@const isLastAdmin = entry.role === 'admin' && adminCount <= 1}
					<li class="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-bg-raised">
						<div class="flex items-center gap-3">
							<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-overlay text-xs font-bold text-secondary">
								{initials(label)}
							</div>
							<div>
								<span class="text-sm font-medium text-primary">{label}{isSelf ? ' (you)' : ''}</span>
							</div>
						</div>
						<div class="flex items-center gap-2">
							{#if entry.role === 'admin'}
								<span class="rounded-full bg-accent-gradient px-2 py-0.5 text-xs font-black text-text-inverse">Admin</span>
							{:else}
								<span class="rounded-full border border-border px-2 py-0.5 text-xs font-semibold text-secondary">Member</span>
							{/if}
							{#if !isSelf && !isLastAdmin}
								<button
									onclick={() => removeMember(uid)}
									disabled={removingUid === uid}
									aria-label="Remove {label}"
									class="cursor-pointer rounded-lg p-1.5 text-muted transition-colors hover:bg-danger-500/10 hover:text-danger-400 disabled:opacity-50"
								>
									{#if removingUid === uid}
										<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
										</svg>
									{:else}
										<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
											<polyline points="3 6 5 6 21 6"/>
											<path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
											<path d="M10 11v6M14 11v6"/>
											<path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
										</svg>
									{/if}
								</button>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		</section>

		<!-- Invite Members -->
		<section class="bg-surface-gradient rounded-xl border border-border p-5">
			<h2 class="mb-4 font-bold text-primary">Invite Members</h2>

			<form onsubmit={sendInvite} class="flex gap-2">
				<input
					type="email"
					bind:value={inviteEmail}
					placeholder="name@example.com"
					disabled={inviteLoading}
					class="min-w-0 flex-1 rounded-xl border border-border bg-bg-raised px-4 py-2.5 text-sm text-primary placeholder:text-muted focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 disabled:opacity-50"
				/>
				<button
					type="submit"
					disabled={inviteLoading || !inviteEmail.trim()}
					class="bg-primary-gradient shrink-0 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if inviteLoading}
						<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
						</svg>
					{:else}
						Send Invite
					{/if}
				</button>
			</form>

			{#if inviteError}
				<p role="alert" class="mt-3 rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-400">{inviteError}</p>
			{/if}
			{#if inviteSuccess}
				<p class="mt-3 rounded-xl border border-primary-500/30 bg-primary-500/10 px-4 py-3 text-sm text-primary-400">{inviteSuccess}</p>
			{/if}

			{#if pendingInvites.length > 0}
				<div class="mt-5">
					<p class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Pending invites</p>
					<ul class="space-y-2">
						{#each pendingInvites as invite (invite.id)}
							<li class="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5">
								<div class="flex items-center gap-2 min-w-0">
									<svg class="h-4 w-4 shrink-0 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
										<polyline points="22,6 12,13 2,6"/>
									</svg>
									<span class="truncate text-sm text-secondary">{invite.email}</span>
								</div>
								<button
									onclick={() => cancelInvite(invite.id)}
									class="shrink-0 cursor-pointer text-xs text-muted transition-colors hover:text-danger-400"
								>
									Cancel
								</button>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</section>

	{/if}
</main>
