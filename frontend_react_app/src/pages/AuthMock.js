import React from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export function AuthMock() {
  /** Placeholder page for admin and end-user authentication flows. */
  const { user, isAuthenticated, loginAsAdmin, loginAsUser, logout } = useAuth();

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-subtle-gradient border border-blue-900/10 px-5 py-4">
        <h1 className="text-lg font-extrabold text-brand-text">Authentication (Mock)</h1>
        <p className="text-sm text-gray-700 mt-1">
          This is a placeholder for real authentication. Use sample credentials below.
        </p>
      </div>

      <Card title="Sample credentials" subtitle="Temporary / mock logins (no backend)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <div className="text-sm font-extrabold text-brand-text">End User</div>
            <div className="text-sm text-gray-700 mt-1">user@example.com</div>
            <div className="text-xs text-gray-500 mt-1">Password: (not required)</div>
            <div className="mt-3">
              <Button variant="ghost" onClick={loginAsUser}>
                Login as User
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <div className="text-sm font-extrabold text-brand-text">Admin</div>
            <div className="text-sm text-gray-700 mt-1">admin@example.com</div>
            <div className="text-xs text-gray-500 mt-1">Password: (not required)</div>
            <div className="mt-3">
              <Button variant="secondary" onClick={loginAsAdmin}>
                Login as Admin
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Current session">
        {isAuthenticated ? (
          <div className="text-sm text-gray-700">
            Signed in as <span className="font-bold">{user.name}</span> ({user.role}){" "}
            <Button variant="ghost" size="sm" onClick={logout} className="ml-2">
              Sign out
            </Button>
          </div>
        ) : (
          <div className="text-sm text-gray-700">Not signed in.</div>
        )}
      </Card>
    </div>
  );
}
