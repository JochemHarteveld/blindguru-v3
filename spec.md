# PokerClock — Application Specification

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | SvelteKit 5 + TypeScript |
| Styling | Tailwind CSS |
| Backend | Firebase (Auth, Firestore, Storage) |
| Package manager | bun |
| Testing | Vitest |
| Linting | ESLint + Prettier |

---

## 1. Authentication

### 1.1 Features
- Register with email + password
- Log in with email + password
- Reset password via email link
- Persistent session (Firebase Auth `onAuthStateChanged`)
- Protected routes: redirect unauthenticated users to `/login`

### 1.2 Routes
| Route | Description |
|---|---|
| `/login` | Email/password login form |
| `/register` | Registration form (email, password, display name) |
| `/reset-password` | Send reset email form |

### 1.3 Firestore — `users` collection
```
users/{uid}
  displayName: string
  email: string
  createdAt: Timestamp
  avatarUrl?: string
```

---

## 2. Clubs

A club is a named group. One user is the creator/admin. Other users can be invited and become members.

### 2.1 Roles
| Role | Capabilities |
|---|---|
| Admin | Full CRUD on club, blind structures, players, games |
| Member | Create games, view everything |

### 2.2 Routes
| Route | Description |
|---|---|
| `/clubs` | List of clubs the user belongs to |
| `/clubs/new` | Create new club |
| `/clubs/[clubId]` | Club dashboard (blind structures, players, games) |
| `/clubs/[clubId]/settings` | Edit club name, manage members |

### 2.3 Invites
- Admin enters email address of user to invite
- System sends invite (Firestore document + optional email via Firebase Extension or callable function)
- Invited user accepts/declines from `/invites` or from a link
- On accept: user added to `clubs/{clubId}/members`

### 2.4 Firestore — `clubs` collection
```
clubs/{clubId}
  name: string
  adminUid: string
  createdAt: Timestamp
  members: {
    [uid]: { role: 'admin' | 'member', joinedAt: Timestamp }
  }

clubs/{clubId}/invites/{inviteId}
  email: string
  invitedBy: string (uid)
  createdAt: Timestamp
  status: 'pending' | 'accepted' | 'declined'
```

---

## 3. Blind Structures

A blind structure belongs to a club. It defines a sequence of rounds and optional breaks.

### 3.1 Data model
```
clubs/{clubId}/blindStructures/{structureId}
  name: string
  createdAt: Timestamp
  levels: Level[]        // ordered array

Level (round):
  type: 'round'
  durationMinutes: number
  smallBlind: number
  bigBlind: number
  ante: number           // 0 if no ante

Level (break):
  type: 'break'
  durationMinutes: number
  label: string          // e.g. "Dinner Break"
```

### 3.2 Routes
| Route | Description |
|---|---|
| `/clubs/[clubId]/structures/new` | Create blind structure |
| `/clubs/[clubId]/structures/[structureId]` | Edit blind structure |

### 3.3 UI
- Drag-and-drop reorder of levels
- Inline editing of each level row
- Add round / add break buttons
- Delete level with confirmation
- Preview: total duration, number of rounds, number of breaks

---

## 4. Players

Players belong to a club. They are poker personas, not necessarily system users (though linking is optional in future).

### 4.1 Data model
```
clubs/{clubId}/players/{playerId}
  name: string
  avatarUrl?: string     // Firebase Storage URL
  createdAt: Timestamp
```

### 4.2 Routes
| Route | Description |
|---|---|
| `/clubs/[clubId]/players` | List + manage players |
| `/clubs/[clubId]/players/new` | Create player |
| `/clubs/[clubId]/players/[playerId]/edit` | Edit player |

### 4.3 Avatar upload
- Upload image to Firebase Storage at `clubs/{clubId}/players/{playerId}/avatar`
- Resize/crop UI before upload (browser-side, e.g. `canvas` or `cropperjs`)
- Fallback: auto-generated initials avatar

---

## 5. Games

A game belongs to a club. It links a blind structure to a set of players, has a date/time, and progresses through states.

### 5.1 Game states
```
draft → scheduled → live → finished
```

| State | Condition |
|---|---|
| `draft` | Created, not yet started |
| `scheduled` | Date/time set, waiting for start |
| `live` | Admin clicked "Start game" |
| `finished` | All levels complete or admin ends |

### 5.2 Data model
```
clubs/{clubId}/games/{gameId}
  name: string
  date: Timestamp
  startTime: string           // "HH:MM"
  status: 'draft' | 'scheduled' | 'live' | 'finished'
  blindStructureId: string
  createdBy: string           // uid
  createdAt: Timestamp
  startedAt?: Timestamp
  finishedAt?: Timestamp

  players: GamePlayer[]
  seats: SeatAssignment[]     // set after seat draw

GamePlayer:
  playerId: string
  name: string                // denormalized
  avatarUrl?: string          // denormalized
  chipCount?: number          // updated during game for avg stack

SeatAssignment:
  playerId: string
  seatNumber: number          // 1-based

  // live clock state (updated in real time)
  currentLevelIndex: number
  levelStartedAt: Timestamp
  isPaused: boolean
  pausedAt?: Timestamp
  totalPausedMs: number
```

### 5.3 Routes
| Route | Description |
|---|---|
| `/clubs/[clubId]/games` | List games (upcoming + past) |
| `/clubs/[clubId]/games/new` | Create game |
| `/clubs/[clubId]/games/[gameId]` | Game detail / lobby |
| `/clubs/[clubId]/games/[gameId]/edit` | Edit game (only when not live) |
| `/clubs/[clubId]/games/[gameId]/clock` | Live clock page |

### 5.4 Game creation / editing
Fields:
- Name (optional, auto-generated fallback e.g. "Friday Night Poker")
- Date (date picker)
- Start time (time picker)
- Blind structure (dropdown of club structures)
- Players (multi-select from club players)
- Chip count per player (optional, used for avg stack)

Editing allowed while `status !== 'live' && status !== 'finished'`.

### 5.5 Seat assignment
- Button "Draw seats" randomises seat numbers for all selected players
- Visualisation: poker table SVG/canvas with player avatars placed at seats (oval table, seats numbered clockwise)
- Re-draw allowed before game starts
- Seats saved to `games/{gameId}.seats`

---

## 6. Live Clock

### 6.1 Route
`/clubs/[clubId]/games/[gameId]/clock`

Accessible by anyone with the link (no login required for viewing — good for projectors/tablets at the table). Admin controls shown only to authenticated admin/member.

### 6.2 Display elements

| Element | Detail |
|---|---|
| Current level | "Level 7" or "Break" |
| Small blind / Big blind | e.g. 200 / 400 |
| Ante | e.g. 50 (hidden if 0) |
| Countdown timer | MM:SS counting down to end of current level |
| Next level info | blinds of next round, or "Final Level" |
| Next break | time until next break level, or "No break upcoming" |
| Current wall time | live clock HH:MM:SS |
| Players | list with avatars and chip counts |
| Avg stack | total chips / players still in (chip counts must be entered) |

### 6.3 Admin controls (authenticated only)
- Pause / Resume timer
- Next level (skip forward)
- Previous level (go back)
- Add time (+1 min, +5 min buttons)
- End game

### 6.4 Real-time sync
- Firestore `onSnapshot` on `games/{gameId}` keeps all connected clients in sync
- Timer state stored in Firestore (`levelStartedAt`, `isPaused`, `totalPausedMs`)
- Clients compute remaining time locally from Firestore state to avoid server round-trips on every tick

### 6.5 Notifications
- Sound alert (configurable) when level ends
- Visual flash/animation on level change
- Optional: browser `Notification` API for break alerts

---

## 7. Firestore Security Rules (summary)

```
// users: read own, write own
// clubs: read if member, write (create) if auth
// clubs/{clubId}/*: read if member, write if admin
// games clock state: write if member, read if public (no auth required for clock view)
```

Full rules to be written in `firestore.rules`.

---

## 8. Firebase Storage Rules (summary)

- Player avatars: read public, write if club admin

---

## 9. Route Structure (full)

```
/
/login
/register
/reset-password
/invites
/clubs
/clubs/new
/clubs/[clubId]
/clubs/[clubId]/settings
/clubs/[clubId]/structures/new
/clubs/[clubId]/structures/[structureId]
/clubs/[clubId]/players
/clubs/[clubId]/players/new
/clubs/[clubId]/players/[playerId]/edit
/clubs/[clubId]/games
/clubs/[clubId]/games/new
/clubs/[clubId]/games/[gameId]
/clubs/[clubId]/games/[gameId]/edit
/clubs/[clubId]/games/[gameId]/clock
```

---

## 10. State Management

- Firebase Auth state: SvelteKit `$app/stores` + custom `user` rune in `src/lib/stores/auth.svelte.ts`
- Firestore listeners: Svelte 5 `$state` + cleanup in `onDestroy`
- No global store needed beyond auth — data loaded per-route via SvelteKit `load` functions + real-time patches via `onSnapshot`

---

## 11. Non-Functional Requirements

| Concern | Approach |
|---|---|
| Mobile-first | Live clock page optimised for phones/tablets used as poker clocks |
| Offline resilience | Firestore offline persistence enabled |
| Performance | Firestore reads minimised via denormalisation (player name/avatar in game doc) |
| Accessibility | High-contrast mode on clock page (large text, readable from across a table) |
| Security | All writes gated by Firestore rules; no sensitive data client-side |

---

## 12. Out of Scope (v1)

- Real-money transactions / rake tracking
- Hand history logging
- Chat / messaging inside clubs
- Tournament bracket / knockout tracking
- Mobile native app
- Public club discovery
