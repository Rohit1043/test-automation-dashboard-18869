# AI-enabled Test Automation Dashboard (Frontend)

React + TailwindCSS frontend implementing a classic, professional dashboard UI with a persistent left sidebar, top bar branding, and deep-linkable routes for core workflows.

## Features implemented (frontend-only)

- Dashboard shell: **Sidebar + TopBar + main content**
- Routes:
  - Home (mocked file/folder browsing + drag-and-drop uploads)
  - Refine Requirements (placeholder)
  - Generate Test Cases (placeholder)
  - Generate Test Scripts (placeholder)
  - Execute Tests (placeholder)
  - Reports (placeholder)
  - Auth (mock admin/end-user logins)
- Corporate Navy theme (Primary `#1E3A8A`, Secondary `#F59E0B`)
- Centralized runtime config loader with safe defaults
- Basic state management via React Context:
  - Auth state (mocked)
  - UI state (sidebar collapse)
  - Toast notifications

> Note: No backend calls are made yet. An API client stub exists in `src/api/client.js`.

---

## Getting started

From `frontend_react_app/`:

```bash
npm start
```

Open: http://localhost:3000

---

## Environment variables

All env vars are optional. The app will run without them (defaults are used).

Copy the example file if desired:

```bash
cp .env.example .env
```

Supported variables:

- `REACT_APP_API_BASE`
- `REACT_APP_BACKEND_URL`
- `REACT_APP_FRONTEND_URL`
- `REACT_APP_WS_URL`
- `REACT_APP_NODE_ENV`
- `REACT_APP_NEXT_TELEMETRY_DISABLED`
- `REACT_APP_ENABLE_SOURCE_MAPS`
- `REACT_APP_PORT`
- `REACT_APP_TRUST_PROXY`
- `REACT_APP_LOG_LEVEL`
- `REACT_APP_HEALTHCHECK_PATH`
- `REACT_APP_FEATURE_FLAGS`
- `REACT_APP_EXPERIMENTS_ENABLED`

They are read in: `src/config/runtimeConfig.js`.

---

## Project structure

- `src/layouts/` – Dashboard layout
- `src/components/` – Reusable UI components (Sidebar, TopBar, Card, Button, UploadArea, FileList, etc.)
- `src/pages/` – Routed pages
- `src/routes/` – React Router configuration
- `src/context/` – Auth/UI/Toast contexts
- `src/api/` – Stub API client

---

## Styling / theme

TailwindCSS is used for styling. Theme tokens live in `tailwind.config.js` under `colors.brand.*`.

A subtle background gradient helper class is provided: `bg-subtle-gradient`.

---

## Future work (not implemented yet)

- Real authentication (admin vs end-user)
- Backend integration for:
  - File storage and browsing
  - Requirements ingestion and AI refinement
  - Test case/script generation
  - Test execution + WebSocket live logs
  - Reports data retrieval
