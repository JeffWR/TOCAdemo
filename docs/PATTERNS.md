# Architecture Patterns

> **Living document.** Claude must read this before working in any area of the codebase,
> and must update this file in the same commit when introducing a new pattern.

---

## 1. Project Directory Structure

```
TOCAdemo/
├── SampleData/
│   ├── appointments.json
│   ├── profiles.json
│   └── trainingSessions.json
├── docs/
│   ├── PATTERNS.md        ← this file
│   ├── STACK.md
│   └── STYLE.md
├── CLAUDE.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/    ← reusable UI components (folder pattern — see §2)
│   │   ├── hooks/         ← custom React hooks (useXxx.ts pattern — see §4)
│   │   ├── pages/         ← route-level page components (default exports — see §3)
│   │   ├── services/      ← API calls (service layer — see §5)
│   │   ├── context/       ← React Context providers (auth simulation — see §10)
│   │   ├── types/         ← shared TypeScript interfaces and types
│   │   ├── utils/         ← pure utility functions (no side effects)
│   │   ├── App.tsx        ← all routes defined here (see §11)
│   │   └── main.tsx       ← entry point; wraps App in providers
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── backend/
    ├── src/
    │   ├── routes/        ← Express route definitions (see §6)
    │   ├── handlers/      ← request/response logic (see §6)
    │   ├── repositories/  ← data access from JSON files (see §8)
    │   ├── middleware/     ← Express middleware (error, cors, etc.)
    │   ├── utils/         ← asyncHandler and other helpers (see §7)
    │   ├── types/         ← shared backend TypeScript types
    │   └── server.ts      ← Express app init and listen
    ├── package.json
    └── tsconfig.json
```

---

## 2. Component Folder Pattern

Every reusable component lives in its own folder:

```
src/components/PlayerCard/
├── PlayerCard.tsx        ← implementation
├── PlayerCard.test.tsx   ← co-located tests
└── index.ts              ← re-exports PlayerCard (named)
```

`index.ts` content:
```ts
export { PlayerCard } from './PlayerCard';
```

**Rules:**
- Component file name matches folder name exactly.
- Test file lives in the same folder — never in a separate `__tests__/` directory.
- `index.ts` only re-exports; no logic in the barrel file.

---

## 3. Page Components

- Live in `src/pages/`.
- Are **thin** — compose components, pass data from hooks; no inline logic.
- Use **default exports** (React Router convention).
- Named `<FeatureName>Page.tsx` (e.g., `SessionListPage.tsx`).

```tsx
// src/pages/SessionListPage.tsx
import { useSessions } from '../hooks/useSessions';
import { SessionList } from '../components/SessionList';

export default function SessionListPage() {
  const { sessions, isLoading, error } = useSessions();
  return <SessionList sessions={sessions} isLoading={isLoading} error={error} />;
}
```

---

## 4. Custom Hook Pattern

- Live in `src/hooks/`, named `useXxx.ts`.
- Always return `{ data, isLoading, error }` (or a subset).
- Consume a service function — never call `fetch` directly inside a hook.
- Have a co-located test file `useXxx.test.ts`.

```ts
// src/hooks/useSessions.ts
export function useSessions(playerId: string) {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    sessionService.getByPlayer(playerId)
      .then(setSessions)
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [playerId]);

  return { sessions, isLoading, error };
}
```

---

## 5. Service Layer Pattern

- `src/services/api.ts` — thin wrapper around `fetch`; sets base URL and headers.
- Per-resource files: `src/services/sessionService.ts`, `playerService.ts`, etc.
- Hooks import services; **components never call `fetch` or a service directly**.
- Services return typed data or throw typed errors.

```ts
// src/services/api.ts
const BASE_URL = '/api';

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}
```

```ts
// src/services/sessionService.ts
import { get } from './api';
import type { TrainingSession } from '../types';

export const sessionService = {
  getByPlayer: (playerId: string) =>
    get<TrainingSession[]>(`/sessions?playerId=${playerId}`),
};
```

---

## 6. Route → Handler → Repository Pattern

Backend has three distinct layers. **No layer may skip another.**

```
routes/sessions.ts       ← mounts handlers on Express router
handlers/sessionHandler.ts  ← reads req, calls repository, sends response
repositories/sessionRepository.ts  ← reads from JSON; returns typed data
```

```ts
// routes/sessions.ts
import { Router } from 'express';
import { getSessionsByPlayer } from '../handlers/sessionHandler';

const router = Router();
router.get('/', asyncHandler(getSessionsByPlayer));
export default router;
```

---

## 7. Async Handler Wrapper

All Express route handlers are wrapped in `asyncHandler` to forward errors to the
global error middleware without try/catch boilerplate.

```ts
// src/utils/asyncHandler.ts
import type { Request, Response, NextFunction, RequestHandler } from 'express';

export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
```

---

## 8. JSON Repository Pattern

- JSON files are loaded **once at module initialisation** via `fs.readFileSync`.
- Parsed data is stored in a `const` frozen typed array.
- Each repository exposes a consistent interface.

```ts
// src/repositories/profileRepository.ts
import fs from 'fs';
import path from 'path';
import type { Profile } from '../types';

const DATA_PATH = path.resolve(__dirname, '../../../SampleData/profiles.json');
const profiles: ReadonlyArray<Profile> = Object.freeze(
  JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')) as Profile[],
);

export const profileRepository = {
  findAll: (): ReadonlyArray<Profile> => profiles,
  findById: (id: string): Profile | undefined => profiles.find(p => p.id === id),
  findByEmail: (email: string): Profile | undefined =>
    profiles.find(p => p.email === email),
};
```

**Standard interface methods:**
- `findAll()` → all records
- `findById(id)` → single record or `undefined`
- `findByEmail(email)` → single record or `undefined` (profiles only)
- `findByPlayerId(playerId)` → array of records (sessions, appointments)

---

## 9. API Response Envelope

Every Express handler returns one of these two shapes. Never send raw data or raw errors.

```ts
// Success
res.json({ success: true, data: payload });

// Error
res.status(statusCode).json({ success: false, error: 'Human-readable message' });
```

TypeScript types:
```ts
interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiError {
  success: false;
  error: string;
}

type ApiResponse<T> = ApiSuccess<T> | ApiError;
```

---

## 10. Auth Simulation Pattern

There is no real authentication. The "logged-in player" is identified by their email address.

- Email is stored in **React Context** (`PlayerContext`) — never in `localStorage`.
- On "login": look up the profile by email in the API. If not found, return 404.
- On "logout": clear the context value (set to `null`).
- All protected pages read from context — if `null`, redirect to login (see §11).

```tsx
// src/context/PlayerContext.tsx
interface PlayerContextValue {
  email: string | null;
  setEmail: (email: string | null) => void;
}

export const PlayerContext = createContext<PlayerContextValue>({
  email: null,
  setEmail: () => {},
});
```

---

## 11. Routing Pattern

- **All routes** are defined in `src/App.tsx` — no route definitions elsewhere.
- A layout route (`<Layout />`) wraps all protected pages.
- Any protected page reads `PlayerContext`; if email is `null`, redirects to `/login`.

```tsx
// src/App.tsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route element={<Layout />}>
    <Route path="/" element={<Navigate to="/sessions" replace />} />
    <Route path="/sessions" element={<SessionListPage />} />
    <Route path="/sessions/:id" element={<SessionDetailPage />} />
    <Route path="/appointments" element={<AppointmentsPage />} />
  </Route>
</Routes>
```

---

## 12. State Management

Three sources of state — no global state library:

| State type | Where it lives | Examples |
|---|---|---|
| Route/URL state | React Router `useParams`, `useSearchParams` | Current session ID, filter value |
| Auth state | `PlayerContext` (React Context) | Logged-in player email |
| Local async state | Custom hook (`useState` + `useEffect`) | Fetched sessions, loading, error |

**Rules:**
- Prefer URL state for anything shareable (filters, selected IDs).
- Context only for cross-cutting concerns (auth).
- No prop drilling beyond two levels — lift state or use context.

---

## 13. Error Handling

**Frontend:**
- Hooks expose `error: string | null` in their return value.
- `<ErrorBoundary>` wraps the app in `main.tsx` to catch render-time errors.
- Each page displays a user-friendly error message when `error` is non-null.

**Backend:**
- All route handlers are wrapped in `asyncHandler` (see §7).
- Global error middleware at the bottom of `server.ts` catches anything forwarded via `next(err)`.
- Error middleware returns the API envelope with `success: false` (see §9).
- **Never** send stack traces to the client in production.

```ts
// src/server.ts (global error middleware — must be last)
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});
```
