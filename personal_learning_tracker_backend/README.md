# Personal Learning Tracker Backend

Node.js + Express.js backend API for the Personal Learning Tracker app.

## Features

- CRUD APIs for learning topics
- In-memory storage (no database—data resets on backend restart)
- Filter by status and category
- Fast status update endpoint (`PATCH /topics/:id/status`)
- Progress summary stats for dashboard

## Endpoints

- `GET /topics` — List all topics (optionally filter by `status` or `category`)
- `GET /topics/:id` — Get topic by ID
- `POST /topics` — Create topic (`topic`, `status` required; `notes`, `category`, `targetDate` optional)
- `PUT /topics/:id` — Update topic (full update)
- `PATCH /topics/:id/status` — Update only the status
- `DELETE /topics/:id` — Delete topic

- `GET /status-options` — Get list of valid status values
- `GET /progress` — Dashboard stats: total, not started, in progress, completed

## Usage

1. Install dependencies:

   ```
   npm install
   ```

2. Start the server:

   ```
   npm start
   ```

   The server runs on `http://localhost:4000` by default.

## Notes

- All data will be lost when the backend restarts.
- No authentication is required at this stage.

---
Made for the Personal Learning Tracker app.
