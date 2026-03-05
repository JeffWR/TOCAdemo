# Backend Documentation

**Last Updated:** 2026-03-04
**Stack:** Node 20 · Express 4 · TypeScript 5
**Data Source:** JSON fixtures in `sampledata/`

---

## Architecture Overview

The backend follows a strict **Route → Handler → Repository** three-layer pattern:

```
Request (HTTP)
    ↓
Router (/routes)
    ↓
Handler (async/validate)
    ↓
Repository (data access)
    ↓
JSON File
    ↓
Response (HTTP)
```

**Key principle:** Each layer has a single responsibility. Routes define endpoints; handlers validate and orchestrate; repositories read data.

---

## File-by-File Breakdown

| File | Responsibility | Exports | Key Dependencies |
|---|---|---|---|
| `server.ts` | Express app bootstrap, middleware registration | `app` | `express`, `cors`, routers, error middleware |
| `middleware/errorMiddleware.ts` | Global error handler (catches Promise rejections) | `errorMiddleware` | `express.ErrorRequestHandler` |
| `utils/asyncHandler.ts` | Wraps async handlers to forward errors to middleware | `asyncHandler` | none |
| `types/index.ts` | Shared TypeScript interfaces | `Profile`, `TrainingSession`, `Appointment`, `ApiResponse<T>` | none |
| `repositories/profileRepository.ts` | Loads profiles from JSON, provides query methods | `profileRepository` object | `fs`, `types/Profile` |
| `repositories/sessionRepository.ts` | Loads sessions from JSON, provides query methods | `sessionRepository` object | `fs`, `types/TrainingSession` |
| `repositories/appointmentRepository.ts` | Loads appointments from JSON, provides query methods | `appointmentRepository` object | `fs`, `types/Appointment` |
| `handlers/profileHandler.ts` | Validates query/path params, calls repository, sends response | `getProfileByEmail`, `getProfileById` | `profileRepository`, `Request`, `Response` |
| `handlers/sessionHandler.ts` | Validates query/path params, calls repository, sends response | `getSessionsByPlayer`, `getSessionById` | `sessionRepository`, `Request`, `Response` |
| `handlers/appointmentHandler.ts` | Validates query/path params, calls repository, sends response | `getAppointmentsByPlayer` | `appointmentRepository`, `Request`, `Response` |
| `routes/profiles.ts` | Express Router with two GET endpoints | `profilesRouter` | `asyncHandler`, handlers |
| `routes/sessions.ts` | Express Router with two GET endpoints | `sessionsRouter` | `asyncHandler`, handlers |
| `routes/appointments.ts` | Express Router with one GET endpoint | `appointmentsRouter` | `asyncHandler`, handlers |

---

## API Endpoint Reference

### Profiles

**GET** `/api/profiles?email=<email>`
Query: `email` (string, required)
Response: `{ success: true, data: Profile }` or `{ success: false, error: string }`
Status: 200 (found) · 400 (missing param) · 404 (not found)

**GET** `/api/profiles/:id`
Path: `id` (string, required)
Response: `{ success: true, data: Profile }` or `{ success: false, error: string }`
Status: 200 (found) · 404 (not found)

### Training Sessions

**GET** `/api/sessions?playerId=<playerId>`
Query: `playerId` (string, required)
Response: `{ success: true, data: TrainingSession[] }` or `{ success: false, error: string }`
Status: 200 · 400 (missing param)

**GET** `/api/sessions/:id`
Path: `id` (string, required)
Response: `{ success: true, data: TrainingSession }` or `{ success: false, error: string }`
Status: 200 (found) · 404 (not found)

### Appointments

**GET** `/api/appointments?playerId=<playerId>`
Query: `playerId` (string, required)
Response: `{ success: true, data: Appointment[] }` or `{ success: false, error: string }`
Status: 200 · 400 (missing param)

---

## Data Flow Walkthrough

### Example: GET `/api/sessions?playerId=47cb55dd`

1. **Request arrives** at Express
2. **Router match** (`sessionsRouter.get('/')`) → calls `asyncHandler(getSessionsByPlayer)`
3. **asyncHandler** wraps the async handler to catch any Promise rejection and forward to `next(err)`
4. **Handler logic** (`getSessionsByPlayer`):
   - Extracts `playerId` from `req.query`
   - Validates: `typeof playerId === 'string'` and `playerId.trim() !== ''`
   - If invalid → respond 400 with error message and early return
5. **Repository call** → `sessionRepository.findByPlayerId(playerId)`
   - Repository filters pre-loaded sessions array in memory
   - Returns matching sessions or empty array
6. **Response** → `{ success: true, data: sessions }`
7. **Status 200** sent to client

If handler throws uncaught error → `asyncHandler` catches → calls `next(err)` → `errorMiddleware` responds with 500

---

## Design Decisions

### JSON Loaded Once at Startup

Each repository calls `readFileSync()` at module initialization (top-level code, not in a function). This means:
- **Pro:** Zero I/O on every request; ultra-fast reads; perfect for demo/sample data
- **Con:** No hot-reload; data is immutable; would not scale to large datasets

For a production app with real data, replace repositories with database queries.

### asyncHandler Wrapper Required

Express does **not** automatically catch Promise rejections in async route handlers. Without `asyncHandler`:
```ts
// This rejection is NOT caught by error middleware
router.get('/', async (req, res) => {
  throw new Error('oops');  // ← uncaught rejection → process crash
});
```

With `asyncHandler`:
```ts
// Rejection is forwarded to error middleware → safe response
router.get('/', asyncHandler(async (req, res) => {
  throw new Error('oops');  // ← caught and handled
}));
```

### typeof Guard on req.params

`@types/express@5` types route parameters as `string | string[]` (not just `string`). To safely pass to repository functions expecting `string`, we guard:

```ts
const rawId = req.params['id'];  // could be string | string[]
if (typeof rawId !== 'string') {
  res.status(404).json(...);
  return;
}
// Now TypeScript knows rawId is a string
const profile = profileRepository.findById(rawId);
```

### Response Envelope Pattern

All API responses use the envelope format (see `types/ApiResponse<T>`):

**Success:**
```json
{ "success": true, "data": { ... } }
```

**Error:**
```json
{ "success": false, "error": "description" }
```

This allows clients to check a single `success` boolean and discriminate on `data` vs `error` at the TypeScript level.

### CORS Configuration

Server accepts `origin` from environment variable or defaults to `http://localhost:5173` (frontend Vite dev port). See `server.ts` line 11.

---

## Port & Environment

- **Default port:** 3001 (or `process.env.PORT`)
- **Default CORS origin:** `http://localhost:5173` (or `process.env.CORS_ORIGIN`)
- **Data files:** `sampledata/*.json` (committed to repo, read at startup)

---

## Related Documentation

- [PATTERNS.md](./PATTERNS.md) — Overall architecture patterns (index to all pattern docs)
- [patterns/backend.md](./patterns/backend.md) — Detailed pattern explanations (§6–9, §13)
- [STYLE.md](./STYLE.md) — Code style and naming conventions
