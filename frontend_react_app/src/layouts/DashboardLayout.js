import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { TopBar } from "../components/TopBar";

// PUBLIC_INTERFACE
export function DashboardLayout() {
  /** Main dashboard layout with persistent sidebar and top bar. */
  return (
    <div className="min-h-screen bg-brand-background">
      <div className="flex">
        <Sidebar />

        <div className="flex-1 min-w-0">
          <TopBar />
          <main className="p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
