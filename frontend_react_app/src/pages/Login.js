import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";

const SAMPLES = {
  admin: { email: "admin@example.com", password: "Admin@123" },
  user: { email: "user@example.com", password: "User@123" },
};

// PUBLIC_INTERFACE
export function Login() {
  /** Login page: authenticates locally against mock credentials and redirects on success. */
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => {
    const st = location.state;
    return (st && st.from) || "/";
  }, [location.state]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  // If already authenticated, bounce home (or to requested path).
  if (isAuthenticated) {
    window.setTimeout(() => navigate(from, { replace: true }), 0);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError(err?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-subtle-gradient border border-blue-900/10 px-5 py-4">
        <h1 className="text-lg font-extrabold text-brand-text">Sign in</h1>
        <p className="text-sm text-gray-700 mt-1">
          Sign in to access the dashboard. Authentication is currently{" "}
          <span className="font-semibold">mocked locally</span> (no backend required).
        </p>
      </div>

      <Card title="Credentials" subtitle="Enter your email and password">
        <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-xs text-gray-600 font-semibold">Quick fill:</div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setEmail(SAMPLES.admin.email);
                setPassword(SAMPLES.admin.password);
              }}
              disabled={submitting}
            >
              Admin
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setEmail(SAMPLES.user.email);
                setPassword(SAMPLES.user.password);
              }}
              disabled={submitting}
            >
              User
            </Button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-blue-900/10"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-blue-900/10"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {(localError || error) && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
              {localError || error}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button type="submit" variant="secondary" disabled={loading || submitting}>
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/", { replace: true })}
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            After signing in, you’ll be redirected to:{" "}
            <span className="font-mono">{from}</span>
          </div>
        </form>
      </Card>
    </div>
  );
}
