# BlindGuru v3 — PokerClock

Poker tournament clock with clubs, blind structures, and real-time game management.

## Stack
SvelteKit 5 · TypeScript · Tailwind CSS · Firebase (Auth / Firestore / Storage) · bun

## Features
- Auth: register / login / reset password
- Clubs: create groups, invite members, manage roles (admin / member)
- Blind structures: rounds with small blind, big blind, ante + breaks — drag-and-drop reorder
- Players: per-club player roster with avatars
- Games: create with date/time, blind structure, player selection, random seat draw with table visualisation
- Live clock: real-time synced countdown, blind info, next break, avg stack, admin controls (pause/skip/add time)

## Develop

```sh
bun install
bun run dev
```

## Build

```sh
bun run build
bun run preview
```

## Recreate project scaffold

```sh
bun x sv@0.15.1 create --template minimal --types ts --add prettier eslint vitest="usages:unit,component" tailwindcss="plugins:typography,forms" sveltekit-adapter="adapter:auto" mcp="ide:claude-code+setup:local" --install bun blindguru-v3
```

## Docs
See `spec.md` for full data models, routes, and Firestore rules.
