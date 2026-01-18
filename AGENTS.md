# AGENTS.md

## Project summary
- Frontend: React + Vite with React Router and Tailwind CSS.
- Backend: Node/Express maintenance API in `server.js` using SQLite.
- Auth: email + password with JWT.

## Source of truth
- Vite entry is `index.html` -> `/src/main.jsx`.
- Prefer updating files under `src/` (components/pages) over root-level duplicates.

## Key paths
- `src/main.jsx`, `src/App.jsx`, `src/components/`, `src/pages/`, `src/index.css`
- `server.js` for maintenance API
- `data/maintenance.db` for local database

## Setup
- `npm install`

## Frontend dev/build
- `npm run dev`
- `npm run build`
- `npm run preview`

## Environment variables
Frontend (Vite):
- `VITE_API_BASE_URL`

Backend (`server.js`):
- `PORT`
- `JWT_SECRET`
- `CLIENT_URL` or `CLIENT_URLS`
- `BOOTSTRAP_KEY`
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM`
- `REMINDER_CRON`
- `DB_PATH`

## Notes for agents
- If you need to run the backend locally, use `npm run dev:server`.
- There is no dedicated test runner configured; use `npm run build` as a smoke check when needed.
