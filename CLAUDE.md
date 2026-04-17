## Stack
TS · SvelteKit 5 · Tailwind · Firebase (Auth/Firestore/Storage) · bun · Vitest · ESLint · Prettier

## App: PokerClock
Clubs → blind structures + players + games → live clock page.
Full spec: `spec.md`

## Key data paths
```
users/{uid}
clubs/{clubId}  members:{uid:{role,joinedAt}}
clubs/{clubId}/invites/{id}
clubs/{clubId}/blindStructures/{id}  levels:Level[]
clubs/{clubId}/players/{id}
clubs/{clubId}/games/{id}  players[] seats[] + clock state
```
Clock state on game doc: `currentLevelIndex · levelStartedAt · isPaused · pausedAt · totalPausedMs`

## Theme
Dark navy base · gold accent · subtle gradients. Tokens in `layout.css` (`@theme`). Full reference: `theme.md`.
Key utilities: `bg-surface-gradient`, `bg-primary-gradient`, `bg-accent-gradient`, `text-secondary`, `text-muted`.

## Patterns
- Auth rune: `src/lib/stores/auth.svelte.ts`
- Firestore real-time: `onSnapshot` + Svelte `$state`, cleanup in `onDestroy`
- Load data via SvelteKit `load`, patch live via `onSnapshot`
- Denormalise player name/avatar into game doc

## Svelte MCP Tools — REQUIRED
1. **list-sections** — call FIRST on any Svelte/SvelteKit task to find relevant docs
2. **get-documentation** — fetch ALL relevant sections found above
3. **svelte-autofixer** — run on EVERY Svelte component before sending; repeat until clean
4. **playground-link** — only on user request; never when code written to project files
