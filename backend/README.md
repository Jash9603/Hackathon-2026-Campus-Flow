# Campus Flow Backend

## Setup
1. `cd backend`
2. `npm install`
3. Ensure MongoDB is running on `mongodb://127.0.0.1:27017/campusflow` (or update `.env`).

## Running
- Dev: `npm run dev`
- Prod: `npm start`

## Testing
Scripts are provided to test core modules:
- Auth: `node test_auth.js`
- Events: `node test_event.js`
- Registration: `node test_registration.js`
- Voting: `node test_vote.js`

## API Documentation
- `POST /api/auth/register`: Register user
- `POST /api/auth/login`: Login
- `GET /api/events`: List events (supports `?status=`, `?date=`)
- `POST /api/events`: Create event (Organizer)
- `POST /api/registrations/:eventId`: Register for event
- `POST /api/votes/:eventId`: Cast vote
