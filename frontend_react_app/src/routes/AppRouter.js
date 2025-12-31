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

// PUBLIC_INTERFACE
export function AppRouter() {
  /** Defines application routes for deep-linkable navigation. */
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/requirements" element={<RefineRequirements />} />
          <Route path="/test-cases" element={<GenerateTestCases />} />
          <Route path="/test-scripts" element={<GenerateTestScripts />} />
          <Route path="/execute" element={<ExecuteTests />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/auth" element={<AuthMock />} />
          <Route
            path="*"
            element={
              <div className="rounded-xl bg-white border border-gray-100 p-5">
                <div className="text-lg font-extrabold text-brand-text">404</div>
                <div className="text-sm text-gray-700 mt-1">
                  Page not found.
                </div>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
