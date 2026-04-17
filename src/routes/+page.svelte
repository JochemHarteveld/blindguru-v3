<script lang="ts">
	// Static landing page — no state needed
</script>

<div class="relative min-h-screen overflow-hidden bg-bg-base text-primary">

	<!-- ── Navigation ── -->
	<nav class="fixed top-0 z-50 w-full border-b border-border-subtle bg-bg-base/90 backdrop-blur-sm">
		<div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
			<a href="/" class="flex items-center gap-2">
				<svg class="h-5 w-5 text-accent-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path d="M12 2C9 6 4 8 4 12a4 4 0 0 0 6.5 3.1C10 17 9 19 8 20h8c-1-1-2-3-2.5-4.9A4 4 0 0 0 20 12c0-4-5-6-8-10Z"/>
				</svg>
				<span class="text-lg font-bold tracking-tight text-primary">PokerClock</span>
			</a>
			<div class="flex items-center gap-3">
				<a href="/login" class="text-sm text-secondary transition-colors hover:text-primary">Sign in</a>
				<a href="/register" class="bg-primary-gradient rounded-lg px-4 py-1.5 text-sm font-semibold text-white">
					Get started
				</a>
			</div>
		</div>
	</nav>

	<main>

		<!-- ── Hero ── -->
		<section class="relative flex min-h-screen flex-col items-center justify-center px-4 pb-20 pt-14 text-center">

			<!-- Radial gold glow -->
			<div
				class="pointer-events-none absolute inset-0"
				style="background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(251,191,36,0.07) 0%, transparent 70%);"
				aria-hidden="true"
			></div>

			<!-- Giant faint spade -->
			<div class="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
				<span class="select-none text-[28rem] leading-none opacity-[0.025] text-accent-500">♠</span>
			</div>

			<div class="relative z-10 mx-auto max-w-3xl">
				<!-- Eyebrow badge -->
				<span class="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-600/40 bg-accent-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-400">
					<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/>
					</svg>
					Free to use
				</span>

				<h1 class="mb-4 text-4xl font-black leading-tight tracking-tight text-primary sm:text-5xl lg:text-7xl">
					Run your poker night<br>
					<span class="text-accent-400">like a pro.</span>
				</h1>

				<p class="mx-auto mb-8 max-w-xl text-base leading-relaxed text-secondary sm:text-xl">
					Real-time blind clocks, custom structures, seat draws, and player management — synced live to every device at the table.
				</p>

				<div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
					<a
						href="/register"
						class="bg-primary-gradient w-full rounded-xl px-8 py-3.5 text-base font-bold text-white transition-opacity hover:opacity-90 sm:w-auto"
						style="box-shadow: 0 8px 24px rgba(37,99,235,0.3);"
					>
						Create free account
					</a>
					<a
						href="#clock-preview"
						class="w-full rounded-xl border border-border px-8 py-3.5 text-base font-semibold text-primary transition-colors hover:border-accent-500 hover:text-accent-400 sm:w-auto"
					>
						See it live →
					</a>
				</div>
			</div>

			<!-- Hero clock mock -->
			<div class="relative z-10 mt-16">
				<div
					class="rounded-2xl border border-border bg-bg-surface/60 px-10 py-6 text-center backdrop-blur-sm"
					style="box-shadow: 0 0 60px rgba(251,191,36,0.08), 0 25px 50px rgba(0,0,0,0.4);"
				>
					<p class="mb-1 text-xs font-semibold uppercase tracking-widest text-muted">Level 4 · Blinds</p>
					<p class="text-3xl font-black text-primary">100 / 200</p>
					<p class="timer-glow mt-3 text-6xl font-black tabular-nums text-accent-400 sm:text-8xl">14:32</p>
					<p class="mt-2 text-xs text-muted">Next: 200 / 400</p>
				</div>
			</div>
		</section>

		<!-- ── Features Grid ── -->
		<section class="mx-auto max-w-6xl px-4 py-20 sm:px-6" id="features">
			<div class="mb-12 text-center">
				<h2 class="text-3xl font-black text-primary sm:text-4xl">Everything your game needs</h2>
				<p class="mt-3 text-secondary">One tool. Zero chaos. Pure poker.</p>
			</div>

			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

				<!-- Clubs -->
				<div class="bg-surface-gradient group rounded-xl border border-border p-6 transition-colors hover:border-accent-600/50">
					<div class="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-600/15">
						<svg class="h-5 w-5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 0 0-5-3.874M9 20H4v-2a4 4 0 0 1 5-3.874m6-9a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM21 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM3 8a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z"/>
						</svg>
					</div>
					<h3 class="mb-1.5 font-bold text-primary">Clubs &amp; Members</h3>
					<p class="text-sm leading-relaxed text-secondary">Create a private club, invite your crew, and manage admin and member roles.</p>
				</div>

				<!-- Blind Structures -->
				<div class="bg-surface-gradient group rounded-xl border border-border p-6 transition-colors hover:border-accent-600/50">
					<div class="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-600/15">
						<svg class="h-5 w-5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M3 10h18M3 14h12M3 18h8"/>
						</svg>
					</div>
					<h3 class="mb-1.5 font-bold text-primary">Custom Blind Structures</h3>
					<p class="text-sm leading-relaxed text-secondary">Design round-by-round blind schedules with antes, breaks, and custom durations.</p>
				</div>

				<!-- Players -->
				<div class="bg-surface-gradient group rounded-xl border border-border p-6 transition-colors hover:border-accent-600/50">
					<div class="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-600/15">
						<svg class="h-5 w-5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.9 17.9 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
						</svg>
					</div>
					<h3 class="mb-1.5 font-bold text-primary">Player Roster</h3>
					<p class="text-sm leading-relaxed text-secondary">Track your regulars with names and avatars. No separate account needed for players.</p>
				</div>

				<!-- Games -->
				<div class="bg-surface-gradient group rounded-xl border border-border p-6 transition-colors hover:border-accent-600/50">
					<div class="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-600/15">
						<svg class="h-5 w-5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>
						</svg>
					</div>
					<h3 class="mb-1.5 font-bold text-primary">Game Scheduling</h3>
					<p class="text-sm leading-relaxed text-secondary">Plan upcoming games, pick your blind structure, and choose who's playing.</p>
				</div>

				<!-- Seat Draw -->
				<div class="bg-surface-gradient group rounded-xl border border-border p-6 transition-colors hover:border-accent-600/50">
					<div class="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-600/15">
						<svg class="h-5 w-5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
							<ellipse cx="12" cy="12" rx="9" ry="5.5"/>
							<circle cx="12" cy="6.5" r="1" fill="currentColor" stroke="none"/>
							<circle cx="12" cy="17.5" r="1" fill="currentColor" stroke="none"/>
							<circle cx="3.5" cy="12" r="1" fill="currentColor" stroke="none"/>
							<circle cx="20.5" cy="12" r="1" fill="currentColor" stroke="none"/>
							<circle cx="6.2" cy="8.2" r="1" fill="currentColor" stroke="none"/>
							<circle cx="17.8" cy="15.8" r="1" fill="currentColor" stroke="none"/>
						</svg>
					</div>
					<h3 class="mb-1.5 font-bold text-primary">Seat Draw &amp; Table View</h3>
					<p class="text-sm leading-relaxed text-secondary">Random seat assignment with a live visual poker table layout before the game starts.</p>
				</div>

				<!-- Live Clock -->
				<div class="bg-surface-gradient group rounded-xl border border-border p-6 transition-colors hover:border-accent-600/50">
					<div class="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-600/15">
						<svg class="h-5 w-5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
							<circle cx="12" cy="12" r="9"/>
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/>
						</svg>
					</div>
					<h3 class="mb-1.5 font-bold text-primary">Live Real-time Clock</h3>
					<p class="text-sm leading-relaxed text-secondary">Countdown timer synced across every device at the table. No refresh. No lag.</p>
				</div>

			</div>
		</section>

		<!-- ── How it Works ── -->
		<section class="border-y border-border-subtle bg-bg-surface py-20">
			<div class="mx-auto max-w-4xl px-4 sm:px-6">
				<h2 class="mb-12 text-center text-3xl font-black text-primary sm:text-4xl">
					Up and running in minutes
				</h2>

				<div class="flex flex-col gap-10 sm:flex-row sm:items-start sm:gap-0">

					<div class="flex flex-1 flex-col items-center text-center">
						<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent-500 text-lg font-black text-accent-400">
							1
						</div>
						<h3 class="mb-2 font-bold text-primary">Create your club</h3>
						<p class="max-w-[180px] text-sm text-secondary">Name your club and invite your regular players in seconds.</p>
					</div>

					<div class="hidden items-center justify-center px-4 pt-5 sm:flex" aria-hidden="true">
						<span class="text-2xl text-muted">→</span>
					</div>

					<div class="flex flex-1 flex-col items-center text-center">
						<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent-500 text-lg font-black text-accent-400">
							2
						</div>
						<h3 class="mb-2 font-bold text-primary">Build your structure</h3>
						<p class="max-w-[180px] text-sm text-secondary">Set blind levels, breaks, and durations to match your style of play.</p>
					</div>

					<div class="hidden items-center justify-center px-4 pt-5 sm:flex" aria-hidden="true">
						<span class="text-2xl text-muted">→</span>
					</div>

					<div class="flex flex-1 flex-col items-center text-center">
						<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent-500 text-lg font-black text-accent-400">
							3
						</div>
						<h3 class="mb-2 font-bold text-primary">Start the game</h3>
						<p class="max-w-[180px] text-sm text-secondary">Draw seats, hit start — every device syncs automatically.</p>
					</div>

				</div>
			</div>
		</section>

		<!-- ── Clock Preview ── -->
		<section id="clock-preview" class="px-4 py-20">
			<div class="mx-auto max-w-6xl sm:px-6">

				<div class="mb-12 text-center">
					<h2 class="text-3xl font-black text-primary sm:text-4xl">
						The clock your table deserves
					</h2>
					<p class="mt-3 text-secondary">
						Readable from across the room. Synced to every phone and tablet.
					</p>
				</div>

				<!-- Browser-chrome mock -->
				<div
					class="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-border bg-bg-base shadow-2xl"
					style="box-shadow: 0 0 80px rgba(251,191,36,0.07), 0 25px 50px rgba(0,0,0,0.5);"
				>
					<!-- Chrome bar -->
					<div class="flex items-center gap-2 border-b border-border bg-bg-surface px-4 py-2.5">
						<span class="h-2.5 w-2.5 rounded-full bg-danger-500/60"></span>
						<span class="h-2.5 w-2.5 rounded-full bg-accent-500/60"></span>
						<span class="h-2.5 w-2.5 rounded-full bg-success-500/60"></span>
						<span class="ml-3 flex-1 rounded bg-bg-raised px-3 py-0.5 text-xs text-muted">pokerclock.app/clubs/friday-night/games/1/clock</span>
					</div>

					<!-- Clock body -->
					<div class="p-8 text-center">

						<span class="mb-6 inline-block rounded-full bg-accent-gradient px-4 py-1 text-xs font-black uppercase tracking-widest text-text-inverse">
							Level 4
						</span>

						<p class="timer-glow mb-4 text-[5rem] font-black tabular-nums leading-none text-accent-400 sm:text-[7rem]">
							14:32
						</p>

						<div class="mb-6 flex items-baseline justify-center gap-3">
							<span class="text-3xl font-black text-primary">100</span>
							<span class="text-xl text-muted">/</span>
							<span class="text-3xl font-black text-primary">200</span>
							<span class="ml-2 rounded bg-bg-raised px-2 py-0.5 text-sm text-secondary">Ante 25</span>
						</div>

						<div class="flex justify-center gap-8 text-sm">
							<div class="text-center">
								<p class="text-muted">Next level</p>
								<p class="font-semibold text-secondary">200 / 400</p>
							</div>
							<div class="text-center">
								<p class="text-muted">Avg stack</p>
								<p class="font-semibold text-secondary">14,250</p>
							</div>
							<div class="text-center">
								<p class="text-muted">Players</p>
								<p class="font-semibold text-secondary">8 left</p>
							</div>
						</div>

						<!-- Admin controls (visual only) -->
						<div class="mt-8 flex items-center justify-center gap-3 border-t border-border-subtle pt-6">
							<button class="rounded-lg border border-border p-2 text-muted" disabled aria-hidden="true">
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
								</svg>
							</button>
							<button class="bg-primary-gradient rounded-xl px-5 py-2 text-sm font-bold text-white" disabled aria-hidden="true">
								⏸ Pause
							</button>
							<button class="rounded-lg border border-border p-2 text-muted" disabled aria-hidden="true">
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
								</svg>
							</button>
						</div>

					</div>
				</div>

				<p class="mt-6 text-center text-sm text-muted">
					Admin controls shown above. Anyone with the link can view the clock — no login required.
				</p>
			</div>
		</section>

		<!-- ── CTA Banner ── -->
		<section class="relative overflow-hidden py-20">
			<div
				class="pointer-events-none absolute inset-0"
				style="background: radial-gradient(ellipse 70% 100% at 50% 50%, rgba(37,99,235,0.12) 0%, transparent 70%);"
				aria-hidden="true"
			></div>
			<div class="relative z-10 mx-auto max-w-2xl px-4 text-center sm:px-6">
				<h2 class="mb-3 text-3xl font-black text-primary sm:text-4xl">
					Ready to level up your game?
				</h2>
				<p class="mb-8 text-secondary">
					Free to start. No credit card. Works on every device.
				</p>
				<a
					href="/register"
					class="bg-primary-gradient inline-block rounded-xl px-10 py-4 text-lg font-bold text-white transition-opacity hover:opacity-90"
					style="box-shadow: 0 8px 32px rgba(37,99,235,0.28);"
				>
					Create your free account
				</a>
			</div>
		</section>

	</main>

	<!-- ── Footer ── -->
	<footer class="border-t border-border-subtle bg-bg-surface py-8">
		<div class="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between sm:px-6">
			<div class="flex items-center gap-2">
				<svg class="h-4 w-4 text-accent-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path d="M12 2C9 6 4 8 4 12a4 4 0 0 0 6.5 3.1C10 17 9 19 8 20h8c-1-1-2-3-2.5-4.9A4 4 0 0 0 20 12c0-4-5-6-8-10Z"/>
				</svg>
				<span class="font-bold text-primary">PokerClock</span>
			</div>
			<p class="text-xs text-muted">&copy; 2026 PokerClock. All rights reserved.</p>
		</div>
	</footer>

</div>

<style>
	@keyframes glow-pulse {
		0%, 100% { text-shadow: 0 0 20px rgba(251, 191, 36, 0.25); }
		50%       { text-shadow: 0 0 40px rgba(251, 191, 36, 0.55); }
	}

	.timer-glow {
		animation: glow-pulse 2s ease-in-out infinite;
	}
</style>
