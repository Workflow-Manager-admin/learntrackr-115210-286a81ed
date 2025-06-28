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

## Troubleshooting: Backend Unreachable / React Can't Fetch Topics

If your frontend shows "No topics found" or "Failed to fetch topics. Backend unreachable?", follow this checklist:

1. **Ensure Backend is Running**:
   - In a terminal, navigate to the backend directory:
     ```
     cd personal_learning_tracker_backend
     npm install
     npm start
     ```
   - You should see a message:  
     `Personal Learning Tracker backend running on port 4000`

2. **Check Backend API Directly** (from a terminal):
   - Root test:  
     `curl -i http://localhost:4000/`
     - Should see: `{"message":"Personal Learning Tracker Backend API"}`
   - Topics test:  
     `curl -i http://localhost:4000/topics`
     - Should see empty array (`[]`) if no topics, plus `Access-Control-Allow-Origin` header for CORS.

3. **Test from Browser**:
   - Open [http://localhost:4000/topics](http://localhost:4000/topics) in a browser.
   - Should get an array (possibly empty) as JSON.

4. **CORS Diagnostics**:
   - The backend enables CORS for all origins. If your React frontend is running at `http://localhost:3000`, there should be no CORS errors.
   - Open your browser developer tools → "Network" tab, reload the frontend, and inspect the failing request. Look for:
     - Red error messages about "CORS"
     - Status codes 500, 502, 404, etc.
     - The `Access-Control-Allow-Origin` header (should be present)

5. **Network & Firewall**:
   - Ensure no VPN, firewall, or proxy is blocking access between `localhost:3000` (frontend) and `localhost:4000` (backend).
   - Both should be running on the same machine for local development.

6. **API Base URL**:
   - Check frontend's `.env` or config for `REACT_APP_API_BASE_URL`.  
     It should match `http://localhost:4000` (default for local use).

7. **If All Else Fails**:
   - Check backend terminal for startup errors.
   - Restart both frontend (`npm start` in `personal_learning_tracker_frontend`) and backend.

---

Made for the Personal Learning Tracker app.
