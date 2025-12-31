# AI-enabled Test Automation Dashboard

This repository contains a React frontend for an AI-enabled test automation dashboard.

## Run the frontend

```bash
cd test-automation-dashboard-18869/frontend_react_app
npm start
```

Open: http://localhost:3000

---

## Demo credentials (mock auth)

Authentication is **mocked locally** (no backend). Use:

- Admin
  - Email: `admin@example.com`
  - Password: `Admin@123`
- User
  - Email: `user@example.com`
  - Password: `User@123`

Successful login redirects to the homepage (`/`). All routes are protected behind the mock auth gate.

---

## What’s implemented (UI + mocked behaviors)

### Home
- Browse buttons:
  - **Browse Folder** using `<input type="file" webkitdirectory>`
  - **Browse File** using `<input type="file">`
- A textbox shows the selected file/folder name/path **in-memory only** (clears on refresh).
- **Upload** button simulates upload and shows toast:
  - Success: **"File uploaded"**
  - Empty selection: friendly warning toast
- Drag-and-drop area:
  - Highlights on drag over
  - On drop, uses dropped file/folder name and enables Upload
- Top bar branding remains visible with company name/logo area.

### Sidebar pages
- **Refine Requirement**
  - Button: “Run Refined Requirement”
  - Progress animates ~2–3s then toast: “Refine Requirement completed”
- **Generate Test Cases**
  - Buttons: “Generate Test Cases”, “View Generated Test Cases”, “Pre-Condition”
  - Generate triggers progress and seeds mock test cases in component state
  - View shows a table with columns:
    - ID, Title, Pre-Condition, Steps, Expected Result, Priority
  - Pre-Condition opens a modal with textarea; Save:
    - stores in memory only
    - toast: “Pre-Condition saved”
    - updates future/generated cases with latest text
- **Generate Test Script**
  - Button + progress; toast: “Test script generation completed”
- **Execute Test Script**
  - Button + progress; toast: “Execution completed”
  - Optional mock run summary displayed after completion
- **Generate Report**
  - Buttons: “Generate Report” + “View Report”
  - Generate triggers progress and updates mock counts
  - View shows cards: Total Test Cases, Pass, Failed, Error

---

## Configuration

Environment variables are optional. See:

- `test-automation-dashboard-18869/frontend_react_app/.env.example`
- `test-automation-dashboard-18869/frontend_react_app/src/config/runtimeConfig.js`
