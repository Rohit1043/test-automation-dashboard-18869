import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { Button } from "./Button";

const RoleBadge = ({ role }) => {
  const r = String(role || "").toLowerCase();
  const cls =
    r === "admin"
      ? "bg-amber-50 text-brand-secondary border-amber-200"
      : "bg-blue-50 text-brand-primary border-blue-200";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2 py-0.5",
        "text-[11px] font-extrabold tracking-wide uppercase",
        cls,
      ].join(" ")}
    >
      {r || "user"}
    </span>
  );
};

// PUBLIC_INTERFACE
export function TopBar() {
  /** Fixed top bar for branding and authentication actions (mock/local auth). */
  const { user, isAuthenticated, logout, loading } = useAuth();
  const { toggleSidebar } = useUI();
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = async () => {
    // Ensure we always clear local session first...
    await logout();

    // ...then bounce to /login so protected routes re-gate immediately.
    // We keep state.from so the user can sign back in and return.
    navigate("/login", {
      replace: true,
      state: { from: location.pathname + location.search + location.hash },
    });
  };

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
            <div className="hidden sm:flex items-center gap-2 text-right mr-2">
              <div className="leading-tight">
                <div className="text-sm font-semibold text-brand-text">{user?.name || "User"}</div>
                <div className="text-xs text-gray-600">{user?.email || ""}</div>
              </div>

              <RoleBadge role={user?.role} />
            </div>

            <Button variant="ghost" onClick={onLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Button as={Link} to="/login" variant="secondary">
            Sign in
          </Button>
        )}
      </div>
    </div>
  );
}
