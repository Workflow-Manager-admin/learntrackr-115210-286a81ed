# Personal Learning Tracker Backend — Developer & API Documentation

## Overview

The Personal Learning Tracker backend is a simple RESTful API built with Node.js and Express.js. It enables CRUD operations for tracking learning topics/goals, each having a name, status (Not Started, In Progress, Completed), target date, notes, and optional category. This backend provides endpoints for topic management, progress statistics, and filtering by status or category. **All data is stored in-memory only:** no persistent database is used, so data is lost on server restart.

---

## Architecture & Technology

- **Platform**: Node.js (JavaScript)
- **Framework**: Express.js
- **Data Storage**: In-memory JavaScript array (ephemeral; resets on restart)
- **Port**: Defaults to `4000`
- **CORS**: Enabled for frontend integration
- **Logging**: Morgan (HTTP logger)

### Main Files

- `index.js`: Entry point and main backend server logic
- `package.json`: Dependency and scripts management

---

## Setup & Usage Instructions

### 1. Install Dependencies

In the backend's root folder:

```sh
npm install
```

### 2. Start the Backend Server

```sh
npm start
# Or, for automatic reload on changes (dev mode):
npm run dev
```

By default, the API server is accessible at:  
`http://localhost:4000`

### 3. No Authentication Required

The API currently does NOT require authentication. All endpoints are public and should only be used in trusted/local environments.

---

## API Endpoints

Below are all the available API routes with their descriptions and example usages.

---

### `GET /topics`

**Description:**  
Fetch all learning topics. Supports optional filtering by `status` and/or `category`.

**Query Parameters (optional):**
- `status`: One of `"Not Started"`, `"In Progress"`, `"Completed"`
- `category`: Any string

**Sample Requests:**
- `GET /topics`
- `GET /topics?status=Completed`
- `GET /topics?category=Programming`

**Sample Response:**
```json
[
  {
    "id": "b8e5...",
    "topic": "JavaScript",
    "status": "Completed",
    "targetDate": "2024-06-18",
    "notes": "Practice array methods",
    "category": "Programming",
    "createdAt": "2024-06-10T08:15:30.000Z",
    "updatedAt": "2024-06-14T09:03:33.000Z"
  },
  ...
]
```

---

### `GET /topics/:id`

**Description:**  
Fetch a single learning topic by its `id`.

**Sample Request:**  
`GET /topics/329f7f52-...`

**Sample Success Response:**  
```json
{
  "id": "329f7f52-f7ed-4593-b4e4-dabb03f2f83f",
  "topic": "UI/UX",
  "status": "Not Started",
  "targetDate": "2024-06-18",
  "notes": "",
  "category": "Design",
  "createdAt": "2024-06-16T11:25:12.000Z",
  "updatedAt": "2024-06-16T11:25:12.000Z"
}
```

**Error Response (ID not found):**
```json
{
  "error": "Topic not found"
}
```
Status: `404`

---

### `POST /topics`

**Description:**  
Create a new learning topic.

**Request Body:**
```json
{
  "topic": "Data Structures",
  "status": "In Progress",
  "targetDate": "2024-06-22", // (optional)
  "notes": "Focus on graphs and trees", // (optional)
  "category": "DSA" // (optional)
}
```
- `topic` **(required)**: string
- `status` **(required)**: `"Not Started" | "In Progress" | "Completed"`
- `targetDate`, `notes`, `category` (all optional): string

**Sample Success Response:**  
Status `201`
```json
{
  "id": "c45a5c2c-...",
  "topic": "Data Structures",
  "status": "In Progress",
  "targetDate": "2024-06-22",
  "notes": "Focus on graphs and trees",
  "category": "DSA",
  "createdAt": "2024-06-17T19:34:20.000Z",
  "updatedAt": "2024-06-17T19:34:20.000Z"
}
```

**Error Response (missing/invalid status):**
```json
{
  "error": "Invalid topic name or status."
}
```
Status: `400`

---

### `PUT /topics/:id`

**Description:**  
Full update of a topic's details (all fields can be replaced).

**Request Body:**
```json
{
  "topic": "JavaScript ES6",
  "status": "Completed",
  "targetDate": "2024-06-19",
  "notes": "Arrow functions, map/filter",
  "category": "Programming"
}
```
_All fields are optional; unprovided fields retain current value._

**Sample Success Response:**
```json
{
  "id": "b8e53ca3...",
  "topic": "JavaScript ES6",
  "status": "Completed",
  ...
}
```
**Error Responses:**
- If `id` not found: `{ "error": "Topic not found" }` (404)
- If status invalid: `{ "error": "Invalid status value." }` (400)

---

### `PATCH /topics/:id/status`

**Description:**  
Update ONLY the status field of a topic (fast dashboard update).

**Request Body:**
```json
{
  "status": "In Progress"
}
```
**Sample Success Response:**
```json
{
  "id": "b8e53ca3...",
  "topic": "JavaScript",
  "status": "In Progress",
  ...
}
```

**Errors:**
- If `id` not found: `{ "error": "Topic not found" }` (404)
- If status invalid: `{ "error": "Invalid status value." }` (400)

---

### `DELETE /topics/:id`

**Description:**  
Delete a topic by its `id`.

**Sample Request:**  
`DELETE /topics/329f7f52-f7ed-4593-b4e4-dabb03f2f83f`

**Sample Success Response:**
```json
{
  "success": true
}
```
If `id` not found: `{ "error": "Topic not found" }` (404)

---

### `GET /status-options`

**Description:**  
Returns all allowed status values for a topic. Useful for frontends to populate status dropdowns.

**Sample Response:**
```json
[
  "Not Started",
  "In Progress",
  "Completed"
]
```

---

### `GET /progress`

**Description:**  
Get progress summary stats for dashboard visualizations.

**Sample Response:**
```json
{
  "total": 5,
  "notStarted": 1,
  "inProgress": 2,
  "completed": 2
}
```

---

### `GET /`

**Description:**  
Returns a simple message indicating the backend is running.

**Sample Response:**
```json
{
  "message": "Personal Learning Tracker Backend API"
}
```

---

## API Error Handling

- All errors return a JSON response: `{ "error": "<message>" }`
- Non-existent IDs result in HTTP `404`
- Invalid status values yield HTTP `400`

---

## Developer Notes & Guidance

- Data is **NOT persisted**—after every server restart, all topics are lost.
- Backend is CORS-enabled for easy local frontend development.
- Uses `uuid` for topic IDs (always returned as `id` property).
- All timestamps in responses use ISO 8601 format and fields: `createdAt`, `updatedAt`.
- **No user authentication or authorization** at this phase—if you need to secure the API, consider adding middleware like Passport or JWT in the future.
- Query parameters and error conditions are handled gracefully for all endpoints.
- For detailed code, see `index.js` in the backend source.

---

## Example Integration Workflow

1. **Add a topic:**  
   `POST /topics` with new topic details.

2. **List or filter topics:**  
   `GET /topics?status=Completed`

3. **Edit a topic:**  
   `PUT /topics/:id`

4. **Quick status update:**  
   `PATCH /topics/:id/status`

5. **Delete a topic:**  
   `DELETE /topics/:id`

---

## Mermaid Diagram — Backend Routing & Data Flow

```mermaid
flowchart TD
    A[Client App] -->|HTTP Request| B((Express.js API))
    B --> C{Route}
    C -->|/topics (GET/POST)| D[Topics Array (in-memory)]
    C -->|/topics/:id (GET/PUT/DELETE)| D
    C -->|/topics/:id/status (PATCH)| D
    C -->|/status-options (GET)| E[Allowed Statuses]
    C -->|/progress (GET)| F[Computed Progress Stats]
    B -->|HTTP Response| A
```

---

## License

MIT

---

_Made for the Personal Learning Tracker web app project._
