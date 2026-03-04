# /feature — Scaffold a New Feature with TDD Gate

Usage: `/feature <feature-name> "<short description>"`

Example: `/feature session-list "Player can view their training session history"`

---

## Before Writing Any Code

1. **Read the docs**
   - Read `docs/PATTERNS.md` in full.
   - Read `docs/STYLE.md`.
   - Read `docs/STACK.md`.

2. **Plan all files**
   Present the complete file plan to the user before writing anything:

   ```
   Files to create:
   FRONTEND
   ├── src/components/SessionList/SessionList.tsx
   ├── src/components/SessionList/SessionList.test.tsx
   ├── src/components/SessionList/index.ts
   ├── src/hooks/useSessions.ts
   ├── src/hooks/useSessions.test.ts
   ├── src/services/sessionService.ts
   └── src/pages/SessionListPage.tsx

   BACKEND
   ├── src/routes/sessions.ts
   ├── src/handlers/sessionHandler.ts
   ├── src/handlers/sessionHandler.test.ts
   ├── src/repositories/sessionRepository.ts
   └── src/repositories/sessionRepository.test.ts
   ```

   **Wait for user confirmation before proceeding.**

---

## RED Phase — Write Failing Tests First

For each file in the plan, write the test file **before** the implementation file.

Tests must:
- Be specific to the feature behaviour (not implementation details)
- Cover the happy path and at least one error/edge case
- Use `describe` blocks matching the feature name
- Pass the TypeScript compiler even before implementation exists (use minimal stubs)

Run the tests — they **must fail** at this point. If they pass without implementation, the tests are wrong.

Report: "RED phase complete — X tests failing as expected."

---

## GREEN Phase — Implement

Write the minimum code to make the tests pass. Follow:
- PATTERNS.md for structure and layer separation
- STYLE.md for formatting and naming
- CLAUDE.md Rule 2 (≤ 200 lines), Rule 3 (strict TypeScript)

Run the tests — they **must all pass** now.

Report: "GREEN phase complete — X tests passing."

---

## REFACTOR Phase

- Remove any duplication introduced during GREEN
- Ensure all files are ≤ 200 lines
- Add JSDoc to all exported functions and hooks
- Run tests again to confirm nothing broke

---

## Post-Feature Checks

1. Run `/review` — address any CRITICAL or HIGH findings before finishing.
2. If a new pattern was introduced, update `docs/PATTERNS.md`.
3. Confirm commit message follows convention: `feat(<feature-name>): <description>`

---

## Rules
- **Never skip the RED phase** — tests must be written and run before implementation.
- **Never write implementation code and tests in the same step.**
- If at any point the plan changes significantly, present the updated plan to the user before continuing.
