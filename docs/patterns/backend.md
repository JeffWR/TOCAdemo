# Backend Patterns

_Part of the [Architecture Patterns](../PATTERNS.md) living document._

---

## §6. Route → Handler → Repository Pattern

Backend has three distinct layers. **No layer may skip another.**

```
routes/sessions.ts            ← mounts handlers on Express router
handlers/sessionHandler.ts    ← reads req, calls repository, sends response
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

## §7. Async Handler Wrapper

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

## §8. JSON Repository Pattern

- JSON files are loaded **once at module initialisation** via `fs.readFileSync`.
- Parsed data is stored in a `const` frozen typed array.
- Each repository exposes a consistent interface.

```ts
// src/repositories/profileRepository.ts
import fs from 'fs';
import path from 'path';
import type { Profile } from '../types';

const DATA_PATH = path.resolve(__dirname, '../../../sampledata/profiles.json');
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

## §9. API Response Envelope

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

## §13. Error Handling (Backend)

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
