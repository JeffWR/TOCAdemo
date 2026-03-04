# Frontend Patterns

_Part of the [Architecture Patterns](../PATTERNS.md) living document._

---

## §2. Component Folder Pattern

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

## §3. Page Components

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

## §4. Custom Hook Pattern

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

## §5. Service Layer Pattern

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

## §10. Auth Simulation Pattern

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

## §11. Routing Pattern

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

## §12. State Management

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

## §13. Error Handling (Frontend)

- Hooks expose `error: string | null` in their return value.
- `<ErrorBoundary>` wraps the app in `main.tsx` to catch render-time errors.
- Each page displays a user-friendly error message when `error` is non-null.
