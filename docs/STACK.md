# Technology Stack

> **Rule:** Do NOT add a new library without updating this file with justification.

---

## Frontend

| Technology | Version | Rationale |
|---|---|---|
| React | 18 | Industry standard UI library; concurrent features for responsiveness |
| TypeScript | 5 | Type safety; enables refactoring confidence; interview demonstrates maturity |
| Vite | 5 | Fast dev server with HMR; minimal config; native ESM |
| React Router | 6 | Declarative client-side routing; data APIs optional but available |
| TailwindCSS | 3 | Utility-first; no CSS file bloat; consistent design system in one pass |
| Vitest | latest | Same config as Vite; faster than Jest for TS projects; first-class ESM |
| React Testing Library | latest | Tests user behaviour not implementation; pairs naturally with RTL philosophy |
| `fetch` (native) | — | Zero dependency; sufficient for a JSON API; demonstrates fetch knowledge |

---

## Backend

| Technology | Version | Rationale |
|---|---|---|
| Node.js | 20 LTS | Long-term support; native `fetch`; stable |
| Express | 4 | Minimal, well-understood; no overhead for a JSON-file API |
| TypeScript | 5 | Shared tsconfig patterns; consistent with frontend |
| Vitest | latest | Single test runner across the monorepo |
| ts-node-dev | latest | Fast TypeScript reloading in development; no separate build step |

---

## Deliberately Not Used

| Library | Reason excluded |
|---|---|
| TanStack Query | Over-engineering for a read-mostly JSON-file API |
| Redux / Zustand | Overkill; React Context + URL state is sufficient |
| MongoDB / PostgreSQL | No persistence layer needed; sampledata/ JSON files are the data source |
| Axios | Native fetch is sufficient; removes a dependency |
| tRPC | Backend and frontend are separate processes here; REST is clearer |
| Prisma / TypeORM | No database |

---

## Data Files

Located in `sampledata/`. All files are version-controlled (not gitignored).

### `sampledata/profiles.json`
Player profiles — one record per player.

| Field | Type | Description |
|---|---|---|
| `id` | UUID string | Primary key; links to `trainingSessions.playerId` and `appointments.playerId` |
| `email` | string | Used as login identifier (auth simulation) |
| `firstName` | string | |
| `lastName` | string | |
| `phone` | string | |
| `gender` | string | `"Male"` \| `"Female"` |
| `dob` | ISO date string | Player date of birth |
| `centerName` | string | Home training center |
| `createdAt` | ISO datetime string | Account creation timestamp |

### `sampledata/trainingSessions.json`
Past training sessions with performance metrics.

| Field | Type | Description |
|---|---|---|
| `id` | UUID string | Primary key |
| `playerId` | UUID string | Foreign key → `profiles.id` |
| `trainerName` | string | Coach or trainer name |
| `startTime` | ISO datetime string | Session start |
| `endTime` | ISO datetime string | Session end |
| `numberOfBalls` | number | Balls used in session |
| `bestStreak` | number | Best consecutive successful touches |
| `numberOfGoals` | number | Goals scored |
| `score` | number | Overall session score (0–100) |
| `avgSpeedOfPlay` | number | Average speed metric |
| `numberOfExercises` | number | Distinct exercises completed |

### `sampledata/appointments.json`
Upcoming or past scheduled appointments.

| Field | Type | Description |
|---|---|---|
| `id` | UUID string | Primary key |
| `playerId` | UUID string | Foreign key → `profiles.id` |
| `trainerName` | string | Assigned trainer |
| `startTime` | ISO datetime string | Appointment start |
| `endTime` | ISO datetime string | Appointment end |

---

## Port Conventions

| Service | Port | Notes |
|---|---|---|
| Frontend (Vite dev) | 5173 | Default Vite port |
| Backend (Express) | 3001 | Avoids conflict with common 3000 |
| Vite proxy | `/api/*` → `3001` | Configured in `vite.config.ts`; avoids CORS in dev |

---

## Monorepo Layout

```
TOCAdemo/
├── frontend/          # Vite + React + TS
├── backend/           # Express + TS
├── sampledata/        # JSON data fixtures (version-controlled)
└── docs/              # Architecture docs
```

Workspaces are independent packages; each has its own `package.json` and `tsconfig.json`.
