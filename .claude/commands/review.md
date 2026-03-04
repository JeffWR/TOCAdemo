# /review — Code Review

Four-step review combining the plugin code review with project-specific checks.

## Step 1 — Plugin Review

Invoke `/code-review` from the `everything-claude-code` plugin.
This checks general code quality, security basics, and maintainability.

## Step 2 — Project-Specific Checks

Check the following against project rules (see CLAUDE.md and docs/):

| Check | Rule source | Pass condition |
|---|---|---|
| File length | CLAUDE.md Rule 2 | All files ≤ 200 lines |
| Test coverage | CLAUDE.md Rule 1 | Test file exists for every source file |
| Missing docs | CLAUDE.md Rule 7 | New patterns are in PATTERNS.md |
| Type safety | CLAUDE.md Rule 3 | No `any`, no untyped params/returns |
| API envelope | PATTERNS.md §9 | All handlers return `{ success, data/error }` |
| Layer isolation | PATTERNS.md §6 | No route skips handler; no handler skips repository |
| Named exports | STYLE.md | Default exports only on page components |
| No console.log | STYLE.md | No `console.log` in committed code |

## Step 3 — Run /lint

Invoke `/lint` and include its results in the report.

## Step 4 — Prioritised Report

Output findings sorted by severity:

```
CRITICAL  — security vulnerability or data loss risk
HIGH      — type safety violation, missing test, broken pattern
MEDIUM    — style violation, missing JSDoc, naming issue
INFO      — suggestion, minor improvement
```

Format each finding as:
```
[SEVERITY] file/path.ts:42 — Description of the issue
```

End with a summary:
```
Review complete: X critical · X high · X medium · X info
```

If there is no project code yet: "No source files found — nothing to review."
