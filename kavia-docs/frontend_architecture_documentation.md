# Personal Learning Tracker Frontend — Architecture & Developer Guide

## Overview

The Personal Learning Tracker frontend is a modern React single-page application (SPA) that allows users to manage, organize, and track their learning goals. The web app provides an interactive dashboard to add, view, edit, and filter learning topics—such as "JavaScript", "DSA", or "UI/UX"—with metadata like status, target date, notes, and category.

This documentation covers the app architecture, core features, component structure, visual design principles, backend integration points, and setup guidelines for developers.

---

## Technology Stack

- **Platform:** Web
- **Framework:** [React 18](https://reactjs.org/)
- **Styling:** Vanilla CSS (with support for dark & light theme via CSS variables)
- **Testing:** [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/)
- **Linting:** ESLint (see `eslint.config.mjs`) for code quality
- **Tooling:** Standard `react-scripts` workflow

---

## Key Features

- **Dashboard Homepage**: Displays user progress with summary stats and filtered lists.
- **Add/Edit Learning Topic**: Modal or drawer-based forms to input topic attributes.
- **CRUD Operations**: Fully functional UI for creating, reading, updating, and deleting learning topics.
- **Status & Category Filters**: UI controls for filtering topics by their status (Not Started, In Progress, Completed) and user-defined categories.
- **Status Updates**: Quick ability to change the status of a topic directly from the dashboard.
- **Responsive and Minimal Design**: Clean, accessible interface suitable for both desktop and mobile.
- **Theme Toggle**: Supports switching between light and dark modes.

---

## File & Component Structure

```
personal_learning_tracker_frontend/
    README.md
    package.json
    src/
        App.js           # Root React component
        App.css          # CSS styles with theme variables and component styling
        index.js         # React entry point; renders App into DOM
        index.css        # Baseline global CSS resets
        App.test.js      # Simple starting test for the App component
        setupTests.js    # Test setup (jest-dom)
    eslint.config.mjs    # ESLint configuration for React/JSX
```

### Main React Components

- **`App`** (`src/App.js`)
    - The primary application shell. Handles theme switching and renders the homepage content. In a complete version, would handle routing and global app context.
    - Currently includes a theme toggle feature and branding.

- **Planned (Extensible) Components**
    - **Dashboard**: Area for progress visualization, overview stats, and navigation.
    - **TopicList**: Displays learning topics with status/category filters.
    - **TopicForm**: Modal or drawer UI for adding/editing topics.
    - **TopicCard/Row**: Each topic displayed as a card or table row, with quick action buttons.
    - **Navigation (Sidebar/Topbar)**: Provides access to filters, app sections, and the add topic button.
    - These structures can be expanded as the feature set grows.

---

## UI/UX & Layout

- **Dashboard Layout**: Intended with a sidebar or navigation bar, a main area for topic lists and progress charts, and modal/dialogues for forms.
- **Theme**: Modern, minimalistic; auto theme preference via CSS variables; clear color contrasts; easy readability.
- **Brand Colors** (planned): 
    - Primary: `#1976d2` (blue)
    - Secondary: `#424242` (grey/dark)
    - Accent: `#ffc107`
- **Responsiveness**: Styles adapt from desktop to mobile; button and form sizes responsive.

### Style Guide

Defined in `src/App.css` (theme-aware):
- Use class selectors such as `.App`, `.App-header`, `.theme-toggle`.
- Colors and backgrounds adapt dynamically to theme (light/dark).
- Example variables:
    ```
    :root {
      --bg-primary: #ffffff;
      --text-primary: #282c34;
      --button-bg: #007bff;
    }
    [data-theme="dark"] {
      --bg-primary: #1a1a1a;
      --text-primary: #ffffff;
      --button-bg: #0056b3;
    }
    ```

---

## Integration Points — Backend API

The frontend communicates with the backend Node.js/Express API, expected to run (by default) at `http://localhost:4000`. All data operations (create, update, delete, fetch topics, fetch progress stats, etc.) are performed using RESTful HTTP calls to this API.

**Typical flow:**
- On startup, fetch list of topics (`GET /topics`), status options (`GET /status-options`), and progress stats (`GET /progress`) to initialize UI state.
- On add/edit, send `POST /topics` or `PUT /topics/:id`.
- On status change (e.g., dashboard toggle), send `PATCH /topics/:id/status`.
- When filtering, adjust backend query params as needed.

> See the “backend_api_documentation.md” for full backend endpoints and usage samples.

---

## Getting Started — Developer Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v16+ recommended
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) for package management

### Installation & Local Development

1. **Install dependencies:**

    ```sh
    cd personal_learning_tracker_frontend
    npm install
    ```

2. **Start the app:**

    ```sh
    npm start
    ```

    Access at: [http://localhost:3000](http://localhost:3000)

3. **Run tests:**

    ```sh
    npm test
    ```

4. **Build for production:**

    ```sh
    npm run build
    ```

---

## Extending & Customizing

- **Adding Components**: Place new React components in `src/`. Follow modular and functional paradigms; use hooks for state.
- **Customizing Theme/Colors**: Edit CSS variables in `src/App.css` for global colors and theme handling.
- **Adding API Endpoints**: See backend API doc for endpoints and extend fetch logic as needed.
- **ESLint & Style**: Consistent code style is enforced via ESLint (see config in `eslint.config.mjs`).

---

## Mermaid Diagram: High-Level Component & Data Flow

```mermaid
flowchart TD
    User[User in Browser] -->|Interacts with UI| App[App (React SPA)]
    App -->|Fetch Topics/Stats/Status| Backend[(Backend Express API)]
    App -->|Display: Dashboard, Topic List, Filters| UI[UI Components]
    UI -->|User Actions| App
    subgraph UI Components
      TL[TopicList]
      TF[TopicForm]
      DB[Dashboard]
      FIL[Filters]
      TG[ThemeToggle]
    end
    App -- Theme/State Mgmt --> TG
```

---

## Additional Notes

- **No authentication/authorization** is present in the frontend or backend.
- All state is managed on the frontend in React (typically via useState/useEffect); can be extended using state management libraries if required.
- The codebase is intended as a clean template for further extensibility—component boundaries are kept simple, and customization hooks are possible.
- Follow accessibility and responsive best practices when extending UI.

---

_Made for the Personal Learning Tracker web app project._

