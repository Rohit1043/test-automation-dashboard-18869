import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export function AuthMock() {
  /** Authentication info page (real auth enabled). */
  const { user, isAuthenticated, logout, loading } = useAuth();

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-subtle-gradient border border-blue-900/10 px-5 py-4">
        <h1 className="text-lg font-extrabold text-brand-text">Authentication</h1>
        <p className="text-sm text-gray-700 mt-1">
          Authentication is now handled via backend endpoints:
          <code className="ml-1 font-mono text-xs">/auth/login</code>,
          <code className="ml-1 font-mono text-xs">/auth/me</code>,
          <code className="ml-1 font-mono text-xs">/auth/logout</code>.
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

      <Card title="Current session">
        {loading ? (
          <div className="text-sm text-gray-700">Checking session…</div>
        ) : isAuthenticated ? (
          <div className="text-sm text-gray-700 space-y-2">
            <div>
              Signed in as <span className="font-bold">{user?.name}</span>{" "}
              <span className="text-gray-500">({user?.email || user?.role})</span>
            </div>
            <div>
              <Button variant="ghost" size="sm" onClick={logout}>
                Sign out
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
