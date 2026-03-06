# TOCA Player Portal

A full-stack web application that allows players to see their past and future training sessions.
Built as a single-page application (SPA) with a React frontend and a Node.js backend.

---

## Architecture at a Glance

```
Frontend                          Backend
────────────────────────────────  ──────────────────────────────────
LoginPage                         routes/
  → sets email in PlayerContext     → handlers/   (validate input)
  → useProfile fetches profile        → repositories/  (read JSON)
  → profile.id drives all hooks           → sampledata/*.json

Data flow per page:
  PlayerContext (email + profile)
    └── useProfile      → GET /api/profiles?email=...   → setProfile()
    └── useSessions     → GET /api/sessions?playerId=...
    └── useAppointments → GET /api/appointments?playerId=...

Key design decisions:
  - email is stored instantly on login; profile is fetched async
  - useSessions / useAppointments wait for profile.id before fetching
  - All API responses use { success, data } | { success, error } envelope
  - Auth state lives in React Context only — never localStorage
  - Data source is sampledata/*.json — no database
```

---

## Features & Requirements

- **Sign-in screen** — player enters their email address (auth simulation, not real auth)
- **Header** — logo + Logout button that returns the player to the sign-in screen
- **Navigation menu** — Home · About TOCA · Profile
- **Home screen** — lists past training sessions and upcoming appointments; past sessions are clickable and navigate to a session detail screen
- **About TOCA screen** — general information about TOCA and how it helps players improve
- **Profile screen** — displays the player's email address and profile information

---

## Out of Scope

- Sign-up, sign-in, real authentication
- Database (data is read from JSON files in `sampledata/`)

---

## Technologies

### Required
- TypeScript
- React
- Node.js

### Chosen (from optional list)
- React Router, TailwindCSS, Vite, Express

> Other libraries are allowed provided the required ones are used.

---

## Data (Provided)

- `sampledata/profiles.json` — player profiles
- `sampledata/trainingSessions.json` — past training sessions with performance metrics
- `sampledata/appointments.json` — upcoming and past appointments

---

## Notes

- AI tools are allowed and encouraged; code must still be understood and explainable
- Use best judgement for layout and information presentation
