# La Maison Benoit Labre Maintenance App

Central maintenance management for La Maison Benoit Labre: tasks, preventive schedules, costs, contractors, and apartment tracking.

## Features
- Admin and staff roles (email + password)
- Task assignment with due dates, costs, and remarks
- Preventive maintenance reminders (email 1 day before)
- Contractors directory with reviews (admin only)
- Apartments (36 units) and common/service areas tracking
- Categories: MEP, Architecture, Civil, FFS, FAS

## Tech
- Frontend: React + Vite + Tailwind
- Backend: Node.js + Express + SQLite

## Quick start (local)
1) Install dependencies
   - `npm install`
2) Start backend
   - `npm run dev:server`
3) Start frontend
   - `npm run dev`

## Backend environment variables
Create `.env` in the project root:
- `PORT=4000`
- `JWT_SECRET=change-me`
- `CLIENT_URL=http://localhost:5173`
- `BOOTSTRAP_KEY=your-bootstrap-key`

Optional email reminders:
- `SMTP_HOST=`
- `SMTP_PORT=`
- `SMTP_USER=`
- `SMTP_PASS=`
- `SMTP_FROM=maintenance@lmb.local`
- `REMINDER_CRON=0 8 * * *`

## Bootstrap first admin
Call `POST /api/auth/bootstrap` with header `x-bootstrap-key` set to `BOOTSTRAP_KEY`.

Payload:
```
{ "name": "Admin", "email": "admin@example.com", "password": "SecurePass123", "phone": "514-000-0000" }
```

## Notes
- Database file is stored at `data/maintenance.db`.
- Reminders are sent 1 day before the task due date.
