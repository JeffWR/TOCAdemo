# TOCA Player Portal

A full-stack sports training portal where players can review their session history, track performance metrics, and view upcoming appointments — all in one place.

Built with **React 19 + TypeScript** on the frontend and **Node.js + Express** on the backend, with a strict architectural layering that mirrors production-grade patterns.

---

## Features

- **Email-based sign-in** — players authenticate with their email; session persists across page reloads via `sessionStorage`
- **Training session history** — scrollable list of past sessions with key stats at a glance
- **Session detail & comparison** — click any session to see how it stacks up against your personal averages across score, goals, streak, and more
- **Upcoming appointments** — scheduled sessions displayed on the home dashboard
- **Player profile** — name, centre, and account details
- **Responsive layout** — mobile-first with a sticky header that hides on scroll

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 + React Router 7 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 3 |
| Build tool | Vite 7 |
| Backend framework | Express 4 |
| Testing | Vitest + React Testing Library |
| Security | Helmet + restricted CORS |

---

## Project Structure

```
TOCAdemo/
├── frontend/src/
│   ├── pages/          # Route-level page components
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Data-fetching custom hooks
│   ├── context/        # PlayerContext (auth state)
│   ├── services/       # Typed API call functions
│   ├── utils/          # Pure utility functions (formatters)
│   └── types/          # Shared TypeScript interfaces
│
├── backend/src/
│   ├── routes/         # URL → handler mapping
│   ├── handlers/       # Input validation + response shaping
│   ├── repositories/   # Data access layer (reads JSON)
│   ├── middleware/     # Global error handler
│   └── types/          # Shared backend interfaces
│
└── sampledata/
    ├── profiles.json
    ├── trainingSessions.json
    └── appointments.json
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+

### Install

```bash
# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### Run (development)

Open two terminals:

```bash
# Terminal 1 — backend (http://localhost:3001)
cd backend && npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd frontend && npm run dev
```

The Vite dev server proxies `/api/*` requests to the backend automatically.

### Login

Use any email from `sampledata/profiles.json`, for example:

```
sabrina.chen@example.com
```

---

## Available Scripts

### Frontend (`/frontend`)

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Type-check and produce a production build |
| `npm run lint` | Run ESLint across all source files |
| `npm test` | Run the full test suite once |
| `npm run test:coverage` | Run tests with V8 coverage report |
| `npm run test:watch` | Run tests in interactive watch mode |

### Backend (`/backend`)

| Command | Description |
|---|---|
| `npm run dev` | Start server with `ts-node-dev` (auto-restart on change) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled production build |
| `npm test` | Run the full test suite once |
| `npm run test:coverage` | Run tests with V8 coverage report |

---

## API Reference

All responses follow the envelope format:

```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "message" }
```

| Method | Endpoint | Query params | Description |
|---|---|---|---|
| GET | `/api/profiles` | `email` | Look up a player profile by email |
| GET | `/api/sessions` | `playerId` | List all sessions for a player |
| GET | `/api/sessions/:id` | — | Get a single session by ID |
| GET | `/api/appointments` | `playerId` | List appointments for a player |

---

## Architecture Decisions

**3-tier backend** — `routes → handlers → repositories`. Routes only map URLs. Handlers own validation and response shaping. Repositories are the only layer that touches data. Each layer is independently testable and the data source can be swapped without touching handlers.

**Co-located tests** — every source file lives alongside its `.test.ts(x)` file. Tests move and delete with the code they cover, no orphans.

**React Context for auth** — player email and profile are held in `PlayerContext`, not `localStorage`. `sessionStorage` is used so auth clears when the tab closes, reducing stale-session risk on shared devices.

**Cancelled-fetch guard** — all `useEffect` data-fetching hooks use a `cancelled` boolean flag to prevent setting state on unmounted components, avoiding memory leaks and React warnings.

---

## Testing

Tests are co-located with source files and run via Vitest. The project targets **≥ 80% overall coverage** with 100% coverage on handlers and repositories.

```bash
# Run all tests across both workspaces
cd frontend && npm test
cd backend && npm test

# With coverage
npm run test:coverage
```
