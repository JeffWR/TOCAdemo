# Frontend Documentation

**Last Updated:** 2026-03-05 (Chunk 3: pages + routing added)
**Stack:** React 19 · TypeScript 5 · Vite 7 · React Router 7
**Data:** Service layer + custom hooks + React Context

---

## Architecture Overview

The frontend uses a **Service → Hook → Context → Component** architecture for data flow:

```
Component (renders UI)
    ↑
    │ calls & reads
    │
Hook (useState + useEffect, returns { data, loading, error })
    ↑
    │ calls
    │
Service (apiFetch wrapper, returns typed data or throws ApiError)
    ↑
    │ calls
    │
Backend API (/api/*)
    ↓
Response ({ success, data } or { success, error } envelope)
```

**Key principle:** Components are thin; they compose hooks and render UI. Hooks manage async state and side effects. Services encapsulate HTTP calls.

---

## File-by-File Breakdown

| File | Responsibility | Exports | Key Dependencies |
|---|---|---|---|
| `src/services/api.ts` | Base fetch wrapper, error handling, response envelope unwrapping | `apiFetch<T>(url)`, `ApiError` class | `fetch` (native), `types` |
| `src/types/index.ts` | Shared TypeScript interfaces and types | `Profile`, `TrainingSession`, `Appointment`, `ApiSuccess<T>`, `ApiFailure` | none |
| `src/services/profileService.ts` | Profile data access methods | `getProfileByEmail(email)`, `getProfileById(id)` | `api.ts`, `types/Profile` |
| `src/services/sessionService.ts` | Training session data access methods | `getSessionsByPlayer(playerId)`, `getSessionById(id)` | `api.ts`, `types/TrainingSession` |
| `src/services/appointmentService.ts` | Appointment data access methods | `getAppointmentsByPlayer(playerId)` | `api.ts`, `types/Appointment` |
| `src/context/PlayerContext/PlayerContext.tsx` | Auth state management via React Context | `PlayerProvider` component, `usePlayerContext()` hook | `createContext`, `useState`, `PropsWithChildren` |
| `src/context/PlayerContext/index.ts` | Context re-export | `PlayerProvider`, `usePlayerContext` | `PlayerContext.tsx` |
| `src/hooks/useProfile.ts` | Fetch player profile by email; writes profile to context for downstream hooks | `{ loading, error }` (returns loading/error only; writes profile to context via `setProfile`) | `useEffect`, `useState`, `usePlayerContext`, `profileService`, `cancelled` flag pattern |
| `src/hooks/useSessions.ts` | Fetch and manage all training sessions for logged-in player | `{ sessions, loading, error }` | `useEffect`, `useState`, `usePlayerContext`, `sessionService`, `cancelled` flag pattern |
| `src/hooks/useSession.ts` | Fetch and manage single session by ID (from URL param) | `{ session, loading, error }` | `useEffect`, `useState`, `sessionService`, `cancelled` flag pattern |
| `src/hooks/useAppointments.ts` | Fetch and manage all appointments for logged-in player | `{ appointments, loading, error }` | `useEffect`, `useState`, `usePlayerContext`, `appointmentService`, `cancelled` flag pattern |
| `src/test/playerWrapper.tsx` | Test utility for wrapping hooks in PlayerContext | `createPlayerWrapper({ email?, profileId? })` | `PlayerProvider`, `ReactNode`, `renderHook` (from RTL) |

---

## Component Library (src/components/)

All components live in their own folder following the Component Folder Pattern (§2). Each folder contains `ComponentName.tsx`, `ComponentName.test.tsx`, and `index.ts`.

<!-- AUTO-GENERATED from src/components/** -->
| Component | Responsibility | Key Props |
|---|---|---|
| `LoadingSpinner` | Accessible animated spinner shown during data fetches | `label?: string` (aria-label, default `"Loading"`) |
| `ErrorMessage` | Standardised error display box with `role="alert"` | `message: string`, `heading?: string` (default `"Error"`) |
| `StatBadge` | Single stat chip — label above, value below | `label: string`, `value: string \| number` |
| `SessionCard` | Training session summary row; links to `/sessions/:id` | `session: TrainingSession` |
| `AppointmentCard` | Single appointment row with "Upcoming" badge | `appointment: Appointment` |
| `SessionList` | Maps a `TrainingSession[]` to `SessionCard` list; shows empty-state text | `sessions: TrainingSession[]` |
| `AppointmentList` | Maps an `Appointment[]` to `AppointmentCard` list; shows empty-state text | `appointments: Appointment[]` |
| `NavMenu` | Horizontal nav links (Home · About TOCA · Profile) using `NavLink` with active styling | none |
| `Header` | Top bar: TOCA brand + `NavMenu` (when logged in) + player first name + Log out button | none |
| `Layout` | React Router layout route — renders `<Header>` above `<main>`; child routes render via `<Outlet>` | none |
| `ProtectedRoute` | Guard route — redirects unauthenticated users to `/login`; renders `<Outlet>` when authenticated | none |
<!-- END AUTO-GENERATED -->

### Composition hierarchy

```
ProtectedRoute (guard — redirects to /login if unauthenticated)
└── Layout
    ├── Header           ← reads email + profile from PlayerContext
    │   └── NavMenu      ← Home / About TOCA / Profile NavLinks
    └── <main> (<Outlet />)
        ├── HomePage
        │   ├── SessionList → SessionCard → StatBadge (score, goals, streak, exercises)
        │   └── AppointmentList → AppointmentCard
        ├── SessionDetailPage → StatBadge (all 6 stats)
        ├── AboutPage (static)
        └── ProfilePage ← reads profile from PlayerContext
```

### MemoryRouter in tests

Any component that renders a React Router `<Link>` (currently `SessionCard`) must be wrapped in `<MemoryRouter>` inside its test file:

```tsx
render(
  <MemoryRouter>
    <SessionCard session={session} />
  </MemoryRouter>,
);
```

---

## Pages (src/pages/)

All pages follow the Page Component pattern (§3): default export, thin — only compose hooks and components.

<!-- AUTO-GENERATED from src/pages/** -->
| Page | Route | Hooks Used | Description |
|---|---|---|---|
| `LoginPage` | `/login` | none | Email input form; calls `setEmail` + navigates to `/` on submit; public (no auth required) |
| `HomePage` | `/` | `useProfile`, `useSessions`, `useAppointments` | Combined dashboard showing training sessions and upcoming appointments |
| `SessionDetailPage` | `/sessions/:id` | `useSession(id)` | Full stats for a single training session (all 6 stat badges + trainer + date) |
| `AboutPage` | `/about` | none | Static page describing the TOCA training platform |
| `ProfilePage` | `/profile` | `useProfile` | Displays logged-in player's profile data (name, email, phone, DOB, gender, center, member since) |
<!-- END AUTO-GENERATED -->

### Route tree

```
/login                    ← LoginPage (public)
/                         ← ProtectedRoute
  /                       ←   Layout (Header + Outlet)
    /                     ←     HomePage
    /sessions/:id         ←     SessionDetailPage
    /about                ←     AboutPage
    /profile              ←     ProfilePage
*                         ← Navigate to / (then redirected to /login if unauthenticated)
```

---

## Service Layer (src/services/)

### api.ts — Base Fetch Wrapper

```ts
export class ApiError extends Error { ... }

export async function apiFetch<T>(url: string): Promise<T> {
  // 1. Fetch from /api/...
  // 2. Handle network errors (throw as ApiError)
  // 3. Parse response as JSON
  // 4. If { success: true }, return data
  // 5. If { success: false }, throw ApiError(error message)
}
```

**Key design:**
- Single responsibility: unwrap the response envelope
- Throws `ApiError` on API error; propagates network errors
- Callers do not need to check `response.ok` or `.json()`

### profileService, sessionService, appointmentService

Each service file exports one or more async methods:

```ts
export async function getProfileByEmail(email: string): Promise<Profile> {
  return apiFetch<Profile>(`/profiles?email=${encodeURIComponent(email)}`);
}

export async function getSessionsByPlayer(playerId: string): Promise<TrainingSession[]> {
  return apiFetch<TrainingSession[]>(`/sessions?playerId=${playerId}`);
}
```

**Rules:**
- Never fetch data directly in components — always via a service function
- Services are stateless; they do not manage component state
- Use `encodeURIComponent` for query parameters (e.g., email addresses with special chars)

---

## React Context (src/context/PlayerContext/)

### PlayerContext.tsx

Provides auth state (logged-in player email) to the entire app tree.

```ts
interface PlayerContextValue {
  email: string | null;
  profile: Profile | null;
  setEmail: (email: string | null) => void;
  setProfile: (profile: Profile | null) => void;
  logout: () => void;
}

export const PlayerProvider = ({
  children,
  initialEmail,
  initialProfile
}: {
  children: ReactNode;
  initialEmail?: string;
  initialProfile?: Profile;
}) => { ... }

export function usePlayerContext(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayerContext must be used inside <PlayerProvider>');
  return ctx;
}
```

**Key features:**
- `initialEmail` and `initialProfile` props allow test seeding (see below)
- `usePlayerContext()` throws descriptive error if called outside provider
- `logout()` clears both email and profile

---

## Custom Hooks (src/hooks/)

All hooks follow a consistent shape and use a **cancelled flag** to prevent stale state updates.

### Hook Return Shape

```ts
{
  data: T | null,          // null until fetch completes
  loading: boolean,        // true initially (or until mounted with data already in context)
  error: string | null     // null unless API error occurred
}
```

### Cancelled Flag Pattern

In every hook `useEffect`:

```ts
useEffect(() => {
  let cancelled = false;

  async function fetchData() {
    try {
      const result = await service.getX(...);
      if (!cancelled) setSomething(result);  // Only update if component is still mounted
    } catch (err) {
      if (!cancelled) setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }

  fetchData();

  return () => {
    cancelled = true;  // Cleanup: prevent state updates after unmount
  };
}, [/* dependencies */]);
```

**Why:** Prevents "Can't perform a React state update on an unmounted component" warnings and memory leaks.

### Loading Initialisation

If the required data (e.g., `profile.id`) is already available in Context at mount time, `loading` initialises to `false`:

```ts
const { profile } = usePlayerContext();
const [loading, setLoading] = useState(profile ? false : true);
```

**Why:** Prevents UI flicker when data is cached or pre-seeded in context.

### useProfile

- Reads `email` from context
- Fetches profile via `profileService.getProfileByEmail(email)`
- On success, writes profile to context via `setProfile(data)` so that `useSessions` and `useAppointments` can read `profile.id`
- Returns `{ loading, error }` only; the resolved profile is accessible via `usePlayerContext().profile`
- Does not fetch if email is `null` (not yet logged in)

### useSessions

- Reads `profile` from context (populated by `useProfile` on successful login)
- Fetches sessions via `sessionService.getSessionsByPlayer(profile.id)` once profile is available
- Returns `{ sessions, loading, error }`
- Does not fetch if profile is not yet in context

### useSession

- Takes `id: string` parameter (typically from URL via `useParams()`)
- Fetches single session via `sessionService.getSessionById(id)`
- Returns `{ session, loading, error }`

### useAppointments

- Reads `profile` from context (populated by `useProfile` on successful login)
- Fetches appointments via `appointmentService.getAppointmentsByPlayer(profile.id)` once profile is available
- Returns `{ appointments, loading, error }`
- Does not fetch if profile is not yet in context

---

## Test Utilities (src/test/)

### playerWrapper.tsx

Helper function for testing hooks that depend on `PlayerContext`:

```ts
export function createPlayerWrapper({
  email = 'test@example.com',
  profileId = 'test-player-id'
}: {
  email?: string;
  profileId?: string;
} = {}): React.ReactElement {
  return (
    <PlayerProvider initialEmail={email} initialProfile={{ id: profileId, ... }}>
      {children}
    </PlayerProvider>
  );
}
```

**Usage in tests:**

```ts
const { result } = renderHook(() => useSessions(), {
  wrapper: createPlayerWrapper({ profileId: '123' })
});
```

**Why:** Allows tests to control context state without mocking; cleaner than manually wrapping with `<PlayerProvider>`.

---

## Build & Development Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `vite` | Start dev server (http://localhost:5173) with HMR |
| `build` | `tsc -b && vite build` | Type-check + build for production |
| `test` | `vitest run` | Run all tests once |
| `test:coverage` | `vitest run --coverage` | Run tests + generate coverage report |
| `test:watch` | `vitest` | Watch mode; re-run on file changes |
| `lint` | `eslint .` | Check code style |
| `preview` | `vite preview` | Preview production build locally |

---

## Development Setup

### Prerequisites

- Node 22 LTS (or compatible)
- npm 10+

### First Time Setup

```bash
cd frontend
npm install
npm run dev          # Start dev server on port 5173
```

In another terminal, start the backend:

```bash
cd backend
npm install
npm run dev          # Start Express server on port 3001
```

Frontend will proxy `/api/*` requests to the backend (configured in `vite.config.ts`).

---

## Key Design Decisions

### No Fetch in Components

Components never call `fetch` directly, never import services, and never call `apiFetch`. They only call hooks. This keeps components testable and prevents duplicate fetches.

### Service Functions are Stateless

Services have no internal state. They are pure functions that return data or throw errors. State management (loading, error) lives in hooks, not services.

### Error Messages from API

When `apiFetch` throws `ApiError`, it includes the server's error message. Hooks catch this and pass it to components via the `error` field. Components should display it to the user.

### Context for Auth Only

`PlayerContext` stores email and profile — cross-cutting auth state. It does **not** store sessions, appointments, or other domain-specific data. That data lives in hook state.

### Cancelled Flag Over AbortController

The `cancelled` flag pattern is simpler than `AbortController` for this use case. Both approaches work; this one is more straightforward for junior developers to understand.

---

## Data Flow Example

**User logs in with email `alice@example.com`:**

1. User enters email on login page
2. `handleLogin` calls `setEmail('alice@example.com')` → updates `PlayerContext.email`
3. App navigates to `/` (home)
4. `ProtectedRoute` checks context — `email` is set → renders `<Outlet />`
5. `HomePage` mounts; calls `useProfile()`, `useSessions()`, `useAppointments()`
6. **useProfile hook:**
   - Reads `email` from context
   - Calls `profileService.getProfileByEmail('alice@example.com')`
   - On success, calls `setProfile(profileData)` → writes profile to context
7. `useSessions()` and `useAppointments()` wait for `profile` to appear in context, then:
   - Read `profile.id` from context
   - Call `sessionService.getSessionsByPlayer(profile.id)` and `appointmentService.getAppointmentsByPlayer(profile.id)`
8. Each service calls `apiFetch(...)` → unwraps response envelope → returns typed data
9. Hooks set state: `setLoading(false)`, `setSessions(result)`, `setAppointments(result)`
10. `HomePage` re-renders with all data; renders `SessionList` and `AppointmentList`

**Key insight:** `useProfile` is the bridge. It fetches the profile from the backend and writes it into context. Sibling hooks (`useSessions`, `useAppointments`) read `profile.id` from context, ensuring they fetch the correct data for the logged-in player.

---

## Related Documentation

- [PATTERNS.md](./PATTERNS.md) — Overall architecture patterns index
- [patterns/frontend.md](./patterns/frontend.md) — Detailed pattern explanations (§2–5, §10–13)
- [BACKEND.md](./BACKEND.md) — API layer documentation
- [STYLE.md](./STYLE.md) — Code style and naming conventions
