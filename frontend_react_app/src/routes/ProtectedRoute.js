import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export function ProtectedRoute({ children }) {
  /** Guards routes: redirects unauthenticated users to /login, preserving the original destination. */
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="rounded-xl bg-white border border-gray-100 p-5">
        <div className="text-sm font-extrabold text-brand-text">Loading session…</div>
        <div className="text-sm text-gray-700 mt-1">Checking authentication status.</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search + location.hash }} />;
  }

  return children;
}
