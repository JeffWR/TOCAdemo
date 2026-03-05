# Architecture Patterns

> **Living document.** Claude must read this before working in any area of the codebase,
> and must update this file (and the relevant sub-file) when introducing a new pattern.

---

## Pattern Index

| # | Pattern | File |
|---|---|---|
| 1 | Project Directory Structure | this file |
| 2 | Component Folder Pattern | [frontend.md](./patterns/frontend.md#2-component-folder-pattern) |
| 3 | Page Components | [frontend.md](./patterns/frontend.md#3-page-components) |
| 4 | Custom Hook Pattern | [frontend.md](./patterns/frontend.md#4-custom-hook-pattern) |
| 5 | Service Layer Pattern | [frontend.md](./patterns/frontend.md#5-service-layer-pattern) |
| 6 | Route → Handler → Repository | [backend.md](./patterns/backend.md#6-route--handler--repository-pattern) |
| 7 | Async Handler Wrapper | [backend.md](./patterns/backend.md#7-async-handler-wrapper) |
| 8 | JSON Repository Pattern | [backend.md](./patterns/backend.md#8-json-repository-pattern) |
| 9 | API Response Envelope | [backend.md](./patterns/backend.md#9-api-response-envelope) |
| 10 | Auth Simulation Pattern | [frontend.md](./patterns/frontend.md#10-auth-simulation-pattern) |
| 11 | Routing Pattern | [frontend.md](./patterns/frontend.md#11-routing-pattern) |
| 12 | State Management | [frontend.md](./patterns/frontend.md#12-state-management) |
| 13 | Error Handling | [frontend.md](./patterns/frontend.md#13-error-handling-frontend) · [backend.md](./patterns/backend.md#13-error-handling-backend) |
| 14 | Async Hook Shape | [frontend.md](./patterns/frontend.md#14-async-hook-shape) |
| 15 | Context Seeding for Tests | [frontend.md](./patterns/frontend.md#15-context-seeding-for-tests) |

---

## 1. Project Directory Structure

```
TOCAdemo/
├── sampledata/
│   ├── appointments.json
│   ├── profiles.json
│   └── trainingSessions.json
├── docs/
│   ├── PATTERNS.md        ← this file (index)
│   ├── patterns/
│   │   ├── frontend.md    ← §2–5, §10–13 frontend
│   │   └── backend.md     ← §6–9, §13 backend
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
    │   ├── middleware/    ← Express middleware (error, cors, etc.)
    │   ├── utils/         ← asyncHandler and other helpers (see §7)
    │   ├── types/         ← shared backend TypeScript types
    │   └── server.ts      ← Express app init and listen
    ├── package.json
    └── tsconfig.json
```
