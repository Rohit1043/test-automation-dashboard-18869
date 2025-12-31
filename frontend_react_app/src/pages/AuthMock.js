import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export function AuthMock() {
  /** Authentication info page (mock/local-only auth). */
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = async () => {
    await logout();
    navigate("/login", {
      replace: true,
      state: { from: location.pathname + location.search + location.hash },
    });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-subtle-gradient border border-blue-900/10 px-5 py-4">
        <h1 className="text-lg font-extrabold text-brand-text">Authentication</h1>
        <p className="text-sm text-gray-700 mt-1">
          Authentication is running in <span className="font-semibold">mock / local-only</span>{" "}
          mode. No backend endpoints are required.
        </p>
      </div>

      <Card
        title="Sign in"
        subtitle="Use the dedicated login page (unauthenticated users are redirected automatically)."
        actions={
          <Button as={Link} to="/login" variant="secondary" size="sm">
            Go to Login
          </Button>
        }
      >
        <div className="text-sm text-gray-700">
          If you’re not signed in, attempting to access dashboard routes will redirect you to{" "}
          <code className="font-mono text-xs">/login</code>.
        </div>
      </Card>

      <Card title="Sample credentials" subtitle="Use one of these logins">
        <div className="text-sm text-gray-700 space-y-3">
          <div className="rounded-lg border border-gray-100 bg-white px-3 py-2">
            <div className="font-bold text-brand-text">Admin</div>
            <div className="text-xs text-gray-600 mt-1 font-mono">
              admin@example.com / Admin@123
            </div>
          </div>
          <div className="rounded-lg border border-gray-100 bg-white px-3 py-2">
            <div className="font-bold text-brand-text">User</div>
            <div className="text-xs text-gray-600 mt-1 font-mono">
              user@example.com / User@123
            </div>
          </div>
        </div>
      </Card>

      <Card title="Current session">
        {loading ? (
          <div className="text-sm text-gray-700">Checking session…</div>
        ) : isAuthenticated ? (
          <div className="text-sm text-gray-700 space-y-2">
            <div>
              Signed in as <span className="font-bold">{user?.name}</span>{" "}
              <span className="text-gray-500">
                ({user?.email} • {user?.role})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-700">Not signed in.</div>
        )}
      </Card>
    </div>
  );
}
