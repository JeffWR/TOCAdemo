# Code Style Guide

Applies to all files in `frontend/` and `backend/`. Enforced by Prettier + ESLint.

---

## Prettier Configuration

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": true,
  "semi": true,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

---

## Import Ordering

Imports must be grouped and sorted alphabetically within each group:

```ts
// 1. Node built-ins
import path from 'path';

// 2. Third-party libraries
import express from 'express';
import { render } from '@testing-library/react';

// 3. Internal (absolute or relative)
import { PlayerService } from '../services/playerService';
import type { Player } from './types';
```

No blank lines within a group; one blank line between groups.

---

## Exports

- **Named exports everywhere** — makes refactoring and tree-shaking predictable.
- **Default exports only** for page-level route components (React Router convention).

```ts
// Good — utility
export function formatDate(iso: string): string { ... }

// Good — component (non-page)
export function PlayerCard({ player }: PlayerCardProps) { ... }

// Good — page component (default allowed)
export default function SessionListPage() { ... }

// Bad
export default function formatDate() { ... }
```

---

## Functions

- **≤ 30 lines** per function. If longer, extract a helper.
- **Arrow functions** for React components and callbacks.
- **Function declarations** for utilities and service functions (hoisted, easier to test).
- No anonymous arrow functions assigned to `const` for utilities.

```ts
// Good — component
export const PlayerCard = ({ player }: PlayerCardProps) => { ... };

// Good — utility
export function calculateAge(dob: string): number { ... }

// Bad — utility as arrow
export const calculateAge = (dob: string): number => { ... };
```

---

## Variables

- `const` by default — always.
- `let` only when reassignment is required (loop accumulators, conditional assignment).
- Never `var`.

---

## Boolean Naming

Prefix booleans with a verb that reads naturally:

| Pattern | Example |
|---|---|
| `is` + adjective | `isLoading`, `isAuthenticated` |
| `has` + noun | `hasError`, `hasResults` |
| `can` + verb | `canNavigate`, `canSubmit` |
| `should` + verb | `shouldRefetch` |

---

## TailwindCSS

- **No custom CSS files** — all styling via Tailwind utility classes.
- Group classes in this order: `layout → spacing → colour → typography → interactive`

```tsx
// Good
<button className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none">

// Bad — unsorted, mixed custom CSS
<button className="text-white hover:bg-blue-700 px-4" style={{ color: 'white' }}>
```

---

## Comments

- **No commented-out code** — delete it; git history preserves everything.
- **JSDoc on all exported functions and hooks** — describe purpose, params, return value.
- **No WHAT comments** — the code says what. Comments say WHY.

```ts
// Bad — WHAT comment
// Loop through sessions and calculate average score
const avg = sessions.reduce(...) / sessions.length;

// Good — WHY comment (only if non-obvious)
// ISO 8601 durations can be > 24h, so we use total minutes not hours
const durationMinutes = differenceInMinutes(end, start);
```

---

## Commit Message Convention

### Format

```
type(scope): short description

Date: YYYY-MM-DD HH:MM
```

**Subject line** (first line): `type(scope): short description`
**Body** (after blank line): always include a `Date:` line with local time.

### Types

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `test` | Adding or updating tests |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `docs` | Documentation only |
| `chore` | Build process, deps, tooling |
| `style` | Formatting, whitespace (no logic change) |

### Rules

- Scope is the feature area: `sessions`, `auth`, `appointments`, `player`
- Subject is lowercase, imperative mood, no trailing period
- Subject max 72 characters
- `Date:` line uses local time in `YYYY-MM-DD HH:MM` format

### Examples

```
feat(sessions): add session list page with player filter

Date: 2026-03-03 22:45
```

```
fix(auth): redirect to login when context is cleared

Date: 2026-03-04 09:12
```

### Git Alias (one-time setup)

Add this to your shell profile to stamp the time automatically:

```bash
git config --global alias.cm '!f() { git commit -m "$1

Date: $(date +%Y-%m-%d\ %H:%M)"; }; f'
```

Usage: `git cm "feat(sessions): add session list page"`

This writes the subject line you provide and appends the `Date:` line automatically.

> **Note:** git also stores precise author/committer timestamps in commit metadata
> (visible with `git log --format="%h %ai %s"`). The `Date:` body line is a
> human-friendly supplement, not a replacement.

---

## General Rules

- No `console.log` in committed code (use proper logging or remove before commit)
- No commented-out code
- No `TODO` without a description: `// TODO(jeff): fix edge case when player has no sessions`
- No magic numbers — extract to a named `const`
- All files end with a single newline character
