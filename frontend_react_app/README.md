# AI-enabled Test Automation Dashboard (Frontend)

React + TailwindCSS frontend implementing a classic, professional dashboard UI with a persistent left sidebar, top bar branding, and deep-linkable routes for core workflows.

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

## Features implemented (UI + mocked behaviors)

### Home (`/`)
- **Browse Folder** and **Browse File** buttons
  - Folder selection uses `<input type="file" webkitdirectory>` (Chromium-based browsers)
- A textbox shows the selected file/folder label
  - **In-memory only** (clears on refresh; not persisted)
- **Upload** button simulates uploading the selection
  - Success toast: **"File uploaded"**
  - Warning toast when nothing is selected
- Drag & drop area
  - Highlights on drag over
  - On drop, sets textbox value and enables upload

### Refine Requirement (`/requirements`)
- Button: **Run Refined Requirement**
- Progress bar animates ~2–3 seconds
- Completion toast: **"Refine Requirement completed"**

### Generate Test Cases (`/test-cases`)
- Buttons:
  - **Generate Test Cases** (runs progress + seeds mock cases)
  - **View Generated Test Cases** (shows a table)
  - **Pre-Condition** (opens modal with textarea)
- Saving pre-condition:
  - Stored in memory only (no disk writes)
  - Toast: **"Pre-Condition saved"**
  - Included in subsequent generated test cases

### Generate Test Scripts (`/test-scripts`)
- Button: **Run Generate Test Script**
- Progress bar animates ~2–3 seconds
- Completion toast: **"Test script generation completed"**

### Execute Test Script (`/execute`)
- Button: **Execute Test Script**
- Progress bar animates ~2–3 seconds
- Completion toast: **"Execution completed"**
- Optional mocked run summary shown after completion

### Generate Report (`/reports`)
- Buttons: **Generate Report** and **View Report**
- Generate runs progress and updates mock counts
- View shows cards:
  - Total Test Cases, Pass, Failed, Error

---

## Styling / theme

TailwindCSS is used for styling. Theme tokens live in `tailwind.config.js` under `colors.brand.*`.

A subtle background gradient helper class is provided: `bg-subtle-gradient`.

---

## Project structure

- `src/layouts/` – Dashboard layout
- `src/components/` – Reusable UI components (Sidebar, TopBar, Card, Button, ToastHost, etc.)
- `src/pages/` – Routed pages (including `Login`)
- `src/routes/` – React Router configuration (includes `ProtectedRoute`)
- `src/context/` – Auth/UI/Toast contexts
- `src/api/` – Fetch-based API client (present for future backend integration)
