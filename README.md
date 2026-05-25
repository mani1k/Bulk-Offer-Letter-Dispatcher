# Bulk Offer Letter Dispatcher

A clean React + Tailwind frontend paired with a simple Node.js/Express/MongoDB backend.

## Frontend

1. `cd frontend`
2. `npm install`
3. `npm run dev`

Or from the repository root:
- `npm run frontend`
- `npm run backend`
- `npm run local` to launch both frontend and backend together

The frontend includes a 4-step wizard:
- Step 1: Upload CSV with drag-and-drop and auto-mapping
- Step 2: Review and edit parsed recipient data
- Step 3: Choose and edit a template with placeholders
- Step 4: Preview and send with dispatch settings

## Backend

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env`
4. Fill `MONGO_URI`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `EMAIL_FROM`
5. `npm start`

The backend exposes:
- `POST /api/send-emails`

## Deployment Notes
- Frontend can be deployed to Vercel or Netlify.
- Backend can be hosted on Render, Heroku, or any Node.js environment.
- Ensure CORS is allowed between frontend and backend.
