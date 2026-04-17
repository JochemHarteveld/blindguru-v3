<script lang="ts">
	import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { goto } from '$app/navigation';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function registerEmail() {
		error = '';
		loading = true;
		try {
			const { user } = await createUserWithEmailAndPassword(auth, email, password);
			if (name.trim()) await updateProfile(user, { displayName: name.trim() });
			await goto('/clubs');
		} catch (e: unknown) {
			error = friendlyError(e);
		} finally {
			loading = false;
		}
	}

	async function loginGoogle() {
		error = '';
		loading = true;
		try {
			await signInWithPopup(auth, new GoogleAuthProvider());
			await goto('/clubs');
		} catch (e: unknown) {
			error = friendlyError(e);
		} finally {
			loading = false;
		}
	}

	function friendlyError(e: unknown): string {
		const code = (e as { code?: string }).code ?? '';
		if (code === 'auth/email-already-in-use') return 'An account with this email already exists.';
		if (code === 'auth/weak-password') return 'Password must be at least 6 characters.';
		if (code === 'auth/invalid-email') return 'Please enter a valid email address.';
		return 'Something went wrong. Please try again.';
	}
</script>

<svelte:head><title>Create account · PokerClock</title></svelte:head>

<div class="flex min-h-screen items-center justify-center bg-bg-base px-4">
	<div class="w-full max-w-sm">

		<div class="mb-8 text-center">
			<a href="/" class="mb-6 inline-flex items-center gap-2">
				<svg class="h-6 w-6 text-accent-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path d="M12 2C9 6 4 8 4 12a4 4 0 0 0 6.5 3.1C10 17 9 19 8 20h8c-1-1-2-3-2.5-4.9A4 4 0 0 0 20 12c0-4-5-6-8-10Z"/>
				</svg>
				<span class="text-xl font-black tracking-tight text-primary">PokerClock</span>
			</a>
			<h1 class="mt-4 text-2xl font-black text-primary">Create your account</h1>
			<p class="mt-1 text-sm text-secondary">Free forever. No credit card.</p>
		</div>

		<div class="rounded-2xl border border-border bg-bg-surface p-6 shadow-xl">

			<button
				onclick={loginGoogle}
				disabled={loading}
				class="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-bg-raised px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-accent-600/50 hover:bg-bg-raised disabled:opacity-50"
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
					<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
					<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
					<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
					<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
				</svg>
				Continue with Google
			</button>

			<div class="relative mb-4 flex items-center gap-3">
				<div class="h-px flex-1 bg-border-subtle"></div>
				<span class="text-xs text-muted">or</span>
				<div class="h-px flex-1 bg-border-subtle"></div>
			</div>

			<form onsubmit={(e) => { e.preventDefault(); registerEmail(); }} class="flex flex-col gap-3">
				<div>
					<label for="name" class="mb-1 block text-xs font-semibold text-secondary">Name</label>
					<input
						id="name"
						type="text"
						bind:value={name}
						autocomplete="name"
						placeholder="Your name"
						class="w-full rounded-lg border border-border bg-bg-raised px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:border-accent-500 focus:outline-none"
					/>
				</div>
				<div>
					<label for="email" class="mb-1 block text-xs font-semibold text-secondary">Email</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						autocomplete="email"
						required
						placeholder="you@example.com"
						class="w-full rounded-lg border border-border bg-bg-raised px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:border-accent-500 focus:outline-none"
					/>
				</div>
				<div>
					<label for="password" class="mb-1 block text-xs font-semibold text-secondary">Password</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						autocomplete="new-password"
						required
						minlength="6"
						placeholder="Min. 6 characters"
						class="w-full rounded-lg border border-border bg-bg-raised px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:border-accent-500 focus:outline-none"
					/>
				</div>

				{#if error}
					<p class="rounded-lg border border-danger-500/30 bg-danger-500/10 px-3 py-2 text-sm text-danger-400">{error}</p>
				{/if}

				<button
					type="submit"
					disabled={loading}
					class="bg-primary-gradient mt-1 w-full rounded-xl py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
				>
					{loading ? 'Creating account…' : 'Create account'}
				</button>
			</form>
		</div>

		<p class="mt-4 text-center text-sm text-secondary">
			Already have an account? <a href="/login" class="font-semibold text-accent-400 hover:text-accent-300">Sign in</a>
		</p>
	</div>
</div>
