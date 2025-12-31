import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { Button } from "./Button";

// PUBLIC_INTERFACE
export function TopBar() {
  /** Fixed top bar for branding and authentication actions. */
  const { user, isAuthenticated, logout, loading } = useAuth();
  const { toggleSidebar } = useUI();
  const navigate = useNavigate();

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
            <div className="text-sm font-extrabold text-brand-text">Test Automation</div>
            <div className="text-xs text-gray-600">AI-enabled dashboard</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {loading ? (
          <div className="text-sm text-gray-600">Checking session…</div>
        ) : isAuthenticated ? (
          <>
            <div className="hidden sm:block text-right mr-2">
              <div className="text-sm font-semibold text-brand-text">{user?.name || "User"}</div>
              <div className="text-xs text-gray-600">{user?.email || user?.role || ""}</div>
            </div>
            <Button
              variant="ghost"
              onClick={async () => {
                await logout();
                navigate("/login", { replace: true });
              }}
            >
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button as={Link} to="/login" variant="secondary">
              Sign in
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
