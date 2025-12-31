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
  - Login (**mock/local-only auth**)
- Corporate Navy theme (Primary `#1E3A8A`, Secondary `#F59E0B`)
- Centralized runtime config loader with safe defaults
- State management via React Context:
  - Auth state (**mock/local-only login/logout/me**)
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

## Authentication (Mock / Local-only)

### How it works

- Authentication is **mocked locally** in `src/context/AuthContext.js`.
- No backend calls are made for login/logout/me.
- A minimal session object is stored in `localStorage` under:
  - `ta_session`
- Unauthenticated users attempting to access protected routes are redirected to:
  - `/login`
- After successful login, the app redirects back to the originally requested route.
- The TopBar shows the authenticated user and a working **Sign out** action.

### Sample credentials

Two users are hardcoded:

- Admin
  - Email: `admin@example.com`
  - Password: `Admin@123`
  - Role: `admin`
- User
  - Email: `user@example.com`
  - Password: `User@123`
  - Role: `user`

> Note: Passwords are stored in plain text only because this is mock/local auth. Do not use this approach for production authentication.

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
- `src/api/` – Fetch-based API client (present for future backend integration)

---

## Styling / theme

TailwindCSS is used for styling. Theme tokens live in `tailwind.config.js` under `colors.brand.*`.

A subtle background gradient helper class is provided: `bg-subtle-gradient`.
