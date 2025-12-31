import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const SAMPLE_USERS = {
  admin: { id: "admin-1", name: "Admin User", role: "admin", email: "admin@example.com" },
  user: { id: "user-1", name: "End User", role: "user", email: "user@example.com" },
};

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides mocked authentication state for admin and end-user flows. */
  const [user, setUser] = useState(null);

  const loginAsAdmin = useCallback(() => setUser(SAMPLE_USERS.admin), []);
  const loginAsUser = useCallback(() => setUser(SAMPLE_USERS.user), []);
  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loginAsAdmin,
      loginAsUser,
      logout,
    }),
    [user, loginAsAdmin, loginAsUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth state and mocked actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
