# Frontend Patterns

_Part of the [Architecture Patterns](../PATTERNS.md) living document._

---

## §2. Component Folder Pattern

Every reusable component lives in its own folder:

```
src/components/SessionCard/
├── SessionCard.tsx        ← implementation
├── SessionCard.test.tsx   ← co-located tests
└── index.ts               ← re-exports SessionCard (named)
```

`index.ts` content:
```ts
export { SessionCard } from './SessionCard';
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
- Each page displays a user-friendly error message when `error` is non-null, using `<ErrorMessage>`.

```tsx
// Example page usage
if (error) return <ErrorMessage message={error} />;
```

`ErrorMessage` renders with `role="alert"` for accessibility and accepts an optional `heading` prop.

---

## §14. Async Hook Shape

Most hooks that fetch data return a consistent shape to simplify component code:

```ts
{
  data: T | null;        // null until fetch completes
  loading: boolean;      // true initially; false after fetch completes
  error: string | null;  // null unless an error occurred
}
```

**Exception: hooks that write to context.** Some hooks (like `useProfile`) fetch data and write it to a shared context instead of returning it directly:

```ts
// useProfile writes to context, does not return profile
const { loading, error } = useProfile();

// The resolved profile is read from context, not from the hook return value
const { profile } = usePlayerContext();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
return <ProfileCard profile={profile!} />;
```

**Why this pattern?** Hooks like `useSessions` and `useAppointments` need the `profile.id` to fetch their data. By having `useProfile` write the resolved profile into a shared context, sibling hooks can read it without needing to re-fetch or wait for the parent component to pass it down as a prop.

### Cancelled Flag Pattern

Each hook's `useEffect` uses a `cancelled` flag to prevent stale state updates:

```ts
useEffect(() => {
  let cancelled = false;

  async function fetchData() {
    try {
      const result = await service.get(...);
      if (!cancelled) setData(result);  // Only update if still mounted
    } catch (err) {
      if (!cancelled) setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }

  fetchData();

  return () => {
    cancelled = true;  // Cleanup: set flag so state is not updated after unmount
  };
}, [/* deps */]);
```

**Why:** Prevents warnings ("Can't perform a React state update on an unmounted component") and memory leaks.

### Loading Initialisation

If the required dependency is already available at mount time, initialize `loading` to `false`:

```ts
const { profile } = usePlayerContext();
const [loading, setLoading] = useState(profile ? false : true);
```

**Why:** Avoids UI flicker when data is pre-seeded or cached in context.

---

## §15. Context Seeding for Tests

To make hooks testable without extensive mocking, context providers accept `initialXxx` props that pre-seed state:

```ts
export const PlayerProvider = ({
  children,
  initialEmail,
  initialProfile
}: {
  children: ReactNode;
  initialEmail?: string;
  initialProfile?: Profile;
}) => {
  const [email, setEmail] = useState(initialEmail ?? null);
  const [profile, setProfile] = useState(initialProfile ?? null);
  // ...
};
```

**Test helper utility:**
```ts
// src/test/playerWrapper.tsx
export function createPlayerWrapper({
  email = 'test@example.com',
  profileId = 'test-id'
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

**Usage:**
```ts
import { renderHook } from '@testing-library/react';
import { createPlayerWrapper } from '../test/playerWrapper';
import { useAppointments } from './useAppointments';

test('useAppointments returns appointments for player', () => {
  const { result } = renderHook(() => useAppointments(), {
    wrapper: createPlayerWrapper({ profileId: 'player-123' })
  });

  // ...
});
```

**Benefits:**
- No need to mock `usePlayerContext`
- Cleaner test code than wrapping with JSX manually
- Controlled initial state without complex setup
