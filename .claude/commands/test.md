# /test — Run Tests and Coverage Report

Run the full test suite across both workspaces and evaluate coverage thresholds.

## Steps

1. **Run coverage in frontend**
   ```
   cd frontend && npm run test:coverage
   ```
   Collect: lines %, functions %, branches %, statements %.

2. **Run coverage in backend**
   ```
   cd backend && npm run test:coverage
   ```
   Collect: lines %, functions %, branches %, statements % — broken down by file.

3. **Evaluate thresholds**

   | Code area | Minimum coverage |
   |---|---|
   | Overall (all files) | 80% |
   | `repositories/` | 100% |
   | `handlers/` | 100% |
   | `hooks/` | 80% |
   | `components/` | 80% |

4. **Report results as a table**

   ```
   Workspace    | Lines  | Functions | Branches | Status
   -------------|--------|-----------|----------|--------
   Frontend     |  84%   |   91%     |   78%    | PASS
   Backend      |  97%   |  100%     |   95%    | PASS
   Handlers     | 100%   |  100%     |  100%    | PASS
   Repositories | 100%   |  100%     |  100%    | PASS
   ```

   Status values: `PASS` / `WARN` (within 5% of threshold) / `FAIL` (below threshold)

## Rules
- **Never auto-fix tests** to make them pass. Fix the implementation.
- If coverage drops below threshold, report which files are under-tested.
- If no test files exist yet, report: "No tests found — write tests before running /test."
