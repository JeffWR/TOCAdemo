# CLAUDE.md — TOCAdemo Project Rules

> This file governs all Claude AI sessions in this repository.
> Read it in full at the start of every session.

---

## Project Overview

**TOCAdemo** is a player-facing sports training portal for the TOCA platform.
A logged-in player can view their training session history and upcoming appointments.

- **Stack:** React 19 + TypeScript 5 + Vite 7 (frontend) · Node 22 + Express 4 + TypeScript 5 (backend)
- **Data:** `sampledata/*.json` — no database
- **Testing:** Vitest + React Testing Library
- See [README.md](./README.md) for product context.

---

## Required Reading Before Coding

Before touching any code, read these files:

1. [`docs/PATTERNS.md`](./docs/PATTERNS.md) — architecture patterns; update when adding a new one
2. [`docs/STYLE.md`](./docs/STYLE.md) — Prettier config, naming, export rules, commit format
3. [`docs/STACK.md`](./docs/STACK.md) — tech choices and rationale; update when adding a library

---

## Rule 1: Test-Driven Development (TDD)

**RED → GREEN → REFACTOR. Always in this order.**

- Write the failing test **first**, before any implementation code.
- Minimum coverage: **80% overall** · **100% on repository and handler code**.
- Test framework: **Vitest + React Testing Library** (frontend), **Vitest** (backend).
- Test files are **co-located** with source files — never in a separate `__tests__/` folder.
- File naming: `ComponentName.test.tsx`, `useHookName.test.ts`, `handlerName.test.ts`.
- Do not commit code that causes tests to fail.
- Do not auto-fix tests to make them pass — fix the implementation.

---

## Rule 2: Modular Files

- **200-line maximum** per file. If a file exceeds this, split it.
- **Single responsibility** — each file does one thing.
- Required folder structure for components: `ComponentName/ComponentName.tsx + .test.tsx + index.ts`
- Required backend layers: `routes/ → handlers/ → repositories/` (see PATTERNS.md §6)
- No "god files" — no barrel files with business logic, no components that fetch data and render.

---

## Rule 3: TypeScript Strictness

- `"strict": true` in all `tsconfig.json` files — no exceptions.
- **No `any`** — if the type is unknown, use `unknown` and narrow it.
- **No non-null assertions (`!`)** without an accompanying comment explaining why it's safe.
- All function parameters and return types must be explicitly typed.
- Use `interface` for object shapes; use `type` for unions, intersections, and aliases.
- Share types in `src/types/` — never duplicate a type definition.

---

## Rule 4: Safety & Security

- **No hardcoded secrets or env values** — use `.env` files (gitignored).
- **Validate all inputs** at API boundaries — reject malformed requests with 400.
- **Never expose stack traces** to the client — the global error middleware handles this.
- **CORS:** never use `*` in production — restrict to the frontend origin.
- **No `dangerouslySetInnerHTML`** — ever.
- **No sensitive data in `localStorage`** — auth state lives in React Context only.
- API responses always use the envelope format (see PATTERNS.md §9).

---

## Rule 5: Style Quick Reference

_(Full rules in [`docs/STYLE.md`](./docs/STYLE.md))_

- No `console.log` in committed code.
- No commented-out code — delete it.
- No `TODO` without a description and owner: `// TODO(name): description`.
- Imports: (1) Node built-ins · (2) third-party · (3) internal — alphabetical within groups.
- Named exports everywhere; default exports only for page components.
- `const` by default; `let` only when reassignment is required; never `var`.

---

## Rule 6: Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| React component | PascalCase | `PlayerCard`, `SessionListPage` |
| Custom hook | camelCase with `use` prefix | `useSessions`, `usePlayerContext` |
| Constant | SCREAMING_SNAKE_CASE | `MAX_SESSIONS_PER_PAGE` |
| Route file | kebab-case | `session-list.tsx` |
| TypeScript interface | PascalCase, no `I` prefix | `TrainingSession`, `Profile` |
| TypeScript type alias | PascalCase | `ApiResponse<T>` |
| CSS / Tailwind | utility classes only — no custom class names | — |
| Test file | same name as source + `.test` | `PlayerCard.test.tsx` |

---

## Rule 7: Documentation Maintenance

- If you introduce a **new architectural pattern**, add it to `docs/PATTERNS.md` **in the same commit**.
- If you add a **new library**, add it to `docs/STACK.md` with justification **in the same commit**.
- Never leave docs out of sync with the code.

---

## Commands Available

### Project Commands (writable — in `.claude/commands/`)

| Command | Description |
|---|---|
| `/dev` | Check packages → typecheck both workspaces → start backend (3001) + frontend (5173) |
| `/test` | Run coverage in both workspaces → evaluate 80% threshold → report result table |
| `/lint` | Phase 1: `tsc --noEmit` · Phase 2: ESLint · Phase 3: Prettier check → combined verdict |
| `/review` | Invoke code review → project-specific checks → run `/lint` → prioritised report |
| `/feature <name> "<description>"` | Scaffold a new feature with TDD gate (RED first, then GREEN) |

### Plugin Commands (read-only — from `everything-claude-code` plugin)

| Command | Description |
|---|---|
| `/tdd` | TDD workflow enforcement |
| `/plan` | Requirements + risk assessment + step-by-step plan (waits for confirm) |
| `/code-review` | General code quality review |
| `/security-review` | Security vulnerability scan |
| `/learn-eval` | Extract reusable patterns from session |

---

## Quick Checklist Before Every Commit

- [ ] All new code has tests written first (TDD)
- [ ] No file exceeds 200 lines
- [ ] No `any`, no `console.log`, no commented-out code
- [ ] `tsc --noEmit` passes
- [ ] Tests pass with ≥ 80% coverage
- [ ] New patterns documented in `docs/PATTERNS.md`
- [ ] Commit message follows `type(scope): description` format
