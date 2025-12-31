# AI-enabled Test Automation Dashboard (Frontend)

React + TailwindCSS frontend implementing a classic, professional dashboard UI with a persistent left sidebar, top bar branding, and deep-linkable routes for core workflows.

## Features implemented

- Dashboard shell: **Sidebar + TopBar + main content**
- Routes:
  - Home (mocked file/folder browsing + drag-and-drop uploads)
  - Refine Requirements (placeholder)
  - Generate Test Cases (placeholder)
  - Generate Test Scripts (placeholder)
  - Execute Tests (placeholder)
  - Reports (placeholder)
  - Login (real backend auth)
- Corporate Navy theme (Primary `#1E3A8A`, Secondary `#F59E0B`)
- Centralized runtime config loader with safe defaults
- State management via React Context:
  - Auth state (real login/logout/me)
  - UI state (sidebar collapse)
  - Toast notifications

---

## Getting started

From `frontend_react_app/`:

```bash
npm start
```

Open: http://localhost:3000

---

## Authentication

### How it works

- Unauthenticated users attempting to access protected routes are redirected to:
  - `/login`
- After successful login, the app redirects back to the originally requested route.
- The TopBar shows the authenticated user and a working **Sign out** action.

### Backend endpoints required

The frontend expects the backend at `REACT_APP_API_BASE` (or `REACT_APP_BACKEND_URL`) to provide:

- `POST /auth/login`
  - Request JSON: `{ "email": string, "password": string }`
  - Response JSON should include an access token in one of these fields:
    - `access_token` (preferred) or `accessToken` or `token`
  - Optionally can include a user object in one of these fields:
    - `user` or `me` or `profile`

- `GET /auth/me`
  - Requires header: `Authorization: Bearer <token>`
  - Response can be either the user object directly or include it under:
    - `user` / `me` / `profile`

- `POST /auth/logout` (optional best-effort)
  - Frontend calls it when logging out, but always clears local session client-side.

### Token storage

- The access token is stored in:
  - memory (React state), and
  - `localStorage` under key `ta_access_token` (to persist across reloads)
- Every API request made via `src/api/client.js` attaches:
  - `Authorization: Bearer <token>` when a token is available.

> Note: If your backend uses httpOnly cookies instead of bearer tokens, the client will need an adjustment (credentials mode, no localStorage token).

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
- `src/pages/` – Routed pages (including `Login`)
- `src/routes/` – React Router configuration (includes `ProtectedRoute`)
- `src/context/` – Auth/UI/Toast contexts
- `src/api/` – Fetch-based API client

---

## Styling / theme

TailwindCSS is used for styling. Theme tokens live in `tailwind.config.js` under `colors.brand.*`.

A subtle background gradient helper class is provided: `bg-subtle-gradient`.
