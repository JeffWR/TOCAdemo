# /lint — Typecheck, ESLint, and Prettier

Three-phase lint check across both workspaces. Reports a combined verdict.

## Phase 1 — TypeScript (`tsc --noEmit`)

Run in both workspaces:
```
cd frontend && npx tsc --noEmit
cd backend  && npx tsc --noEmit
```

Report each error with: file path, line number, error code, message.
If no source files exist yet, report: "No TypeScript files found — nothing to check."

## Phase 2 — ESLint

Run in both workspaces:
```
cd frontend && npx eslint src/
cd backend  && npx eslint src/
```

Report each warning and error. Distinguish `error` (blocks) from `warn` (advisory).
If ESLint is not configured yet, report: "ESLint not configured — skipping."

## Phase 3 — Prettier

Run in both workspaces (check only — do NOT auto-format):
```
cd frontend && npx prettier --check "src/**/*.{ts,tsx}"
cd backend  && npx prettier --check "src/**/*.ts"
```

List any files that would be reformatted.
If Prettier is not configured yet, report: "Prettier not configured — skipping."

## Combined Verdict

```
Phase              | Frontend | Backend | Result
-------------------|----------|---------|--------
TypeScript         | PASS     | PASS    | PASS
ESLint             | PASS     | 2 warn  | WARN
Prettier           | PASS     | PASS    | PASS
-------------------|----------|---------|--------
Overall            |          |         | WARN
```

- `PASS` — no errors (warnings allowed)
- `WARN` — warnings present, no errors
- `FAIL` — one or more errors

**Do NOT auto-fix.** Report only. The developer decides what to fix.
