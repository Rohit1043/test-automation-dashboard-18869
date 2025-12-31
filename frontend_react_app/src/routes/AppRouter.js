import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Home } from "../pages/Home";
import { RefineRequirements } from "../pages/RefineRequirements";
import { GenerateTestCases } from "../pages/GenerateTestCases";
import { GenerateTestScripts } from "../pages/GenerateTestScripts";
import { ExecuteTests } from "../pages/ExecuteTests";
import { Reports } from "../pages/Reports";
import { AuthMock } from "../pages/AuthMock";
import { Login } from "../pages/Login";
import { ProtectedRoute } from "./ProtectedRoute";

// PUBLIC_INTERFACE
export function AppRouter() {
  /** Defines application routes for deep-linkable navigation (with auth gating). */
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected area */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requirements"
            element={
              <ProtectedRoute>
                <RefineRequirements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test-cases"
            element={
              <ProtectedRoute>
                <GenerateTestCases />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test-scripts"
            element={
              <ProtectedRoute>
                <GenerateTestScripts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/execute"
            element={
              <ProtectedRoute>
                <ExecuteTests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* Keep existing route but change its purpose (now a helpful info/transition page). */}
          <Route path="/auth" element={<AuthMock />} />

          <Route
            path="*"
            element={
              <div className="rounded-xl bg-white border border-gray-100 p-5">
                <div className="text-lg font-extrabold text-brand-text">404</div>
                <div className="text-sm text-gray-700 mt-1">Page not found.</div>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
