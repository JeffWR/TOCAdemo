# /dev — Start Development Servers

Start the full development environment for TOCAdemo.

## Steps

1. **Check packages installed**
   - Verify `frontend/node_modules/` exists; if not, run `npm install` in `frontend/`.
   - Verify `backend/node_modules/` exists; if not, run `npm install` in `backend/`.

2. **TypeScript check both workspaces**
   - Run `npx tsc --noEmit` in `frontend/`.
   - Run `npx tsc --noEmit` in `backend/`.
   - Report any type errors. If errors exist, do NOT start the servers — fix them first.

3. **Start backend** (port 3001)
   - `cd backend && npm run dev`
   - Backend should start with `ts-node-dev` watching `src/server.ts`.

4. **Start frontend** (port 5173)
   - `cd frontend && npm run dev`
   - Vite dev server with HMR; proxies `/api/*` to `localhost:3001`.

## Expected Output
```
Backend running on http://localhost:3001
Frontend running on http://localhost:5173
```

## If TypeScript Errors Are Found
Report the errors with file path and line number. Do not start servers until resolved.
Offer to fix the errors before proceeding.
