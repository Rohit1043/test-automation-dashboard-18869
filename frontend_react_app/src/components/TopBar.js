import React from "react";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { Button } from "./Button";

// PUBLIC_INTERFACE
export function TopBar() {
  /** Fixed top bar for branding and basic auth actions. */
  const { user, isAuthenticated, loginAsAdmin, loginAsUser, logout } = useAuth();
  const { toggleSidebar } = useUI();

  return (
    <div className="h-14 bg-brand-surface border-b border-gray-100 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-50 text-gray-700"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span className="block w-5 h-5">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-subtle-gradient border border-blue-900/10 flex items-center justify-center">
            <span className="text-brand-primary font-extrabold">TA</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold text-brand-text">
              Test Automation
            </div>
            <div className="text-xs text-gray-600">AI-enabled dashboard</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <>
            <div className="hidden sm:block text-right mr-2">
              <div className="text-sm font-semibold text-brand-text">{user.name}</div>
              <div className="text-xs text-gray-600">{user.role}</div>
            </div>
            <Button variant="ghost" onClick={logout}>
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={loginAsUser}>
              Mock User Login
            </Button>
            <Button variant="secondary" onClick={loginAsAdmin}>
              Mock Admin Login
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
