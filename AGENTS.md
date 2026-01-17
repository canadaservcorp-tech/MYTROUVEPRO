# AGENTS.md

## Project summary
- Frontend: React + Vite with React Router and Tailwind CSS.
- Backend: Node/Express payment server in `server.js` using Square.
- Auth/data: Supabase client helpers in `supabase.js`.

## Source of truth
- Vite entry is `index.html` -> `/src/main.jsx`.
- Prefer updating files under `src/` (components/pages) over root-level duplicates.

## Key paths
- `src/main.jsx`, `src/App.jsx`, `src/components/`, `src/pages/`, `src/index.css`
- `server.js` for payment endpoints
- `schema.sql` for database schema

## Setup
- `npm install`

## Frontend dev/build
- `npm run dev`
- `npm run build`
- `npm run preview`

## Environment variables
Frontend (Vite):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_BACKEND_URL`
- `VITE_SQUARE_APPLICATION_ID`
- `VITE_SQUARE_LOCATION_ID`
- `VITE_SQUARE_ENVIRONMENT`

Backend (`server.js`):
- `SQUARE_ACCESS_TOKEN`
- `SQUARE_APPLICATION_ID`
- `SQUARE_LOCATION_ID`
- `SQUARE_ENVIRONMENT`
- `FRONTEND_URL`
- `PORT`
- `NODE_ENV`

## Notes for agents
- If you need to run the backend locally, verify `express`, `cors`, `square`, and `dotenv` are installed; they are required by `server.js`.
- There is no dedicated test runner configured; use `npm run build` as a smoke check when needed.
