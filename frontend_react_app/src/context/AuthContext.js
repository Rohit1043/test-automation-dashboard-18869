import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createApiClient } from "../api/client";

const AuthContext = createContext(null);

/**
 * We now store a minimal "session" object instead of an access token.
 * This is intentionally local-only mock auth (no backend calls).
 */
const SESSION_STORAGE_KEY = "ta_session";

/**
 * Hardcoded mock users (per requirement).
 * NOTE: Passwords are stored in plain text only because this is mock/local auth.
 */
const MOCK_USERS = [
  {
    email: "admin@example.com",
    password: "Admin@123",
    role: "admin",
    name: "Admin",
  },
  {
    email: "user@example.com",
    password: "User@123",
    role: "user",
    name: "User",
  },
];

const safeReadSession = () => {
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    // Validate shape to avoid restoring unexpected objects.
    const email = typeof parsed.email === "string" ? parsed.email : "";
    const role = typeof parsed.role === "string" ? parsed.role : "";
    const name = typeof parsed.name === "string" ? parsed.name : "";

    if (!email || !role) return null;

    return { email, role, name: name || "User" };
  } catch (_e) {
    return null;
  }
};

const safeWriteSession = (session) => {
  try {
    if (!session) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (_e) {
    // ignore storage failures (private mode, blocked storage, etc.)
  }
};

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides mock authentication state and actions (local-only; no backend). */
  const [user, setUser] = useState(null); // { email, role, name }
  const [accessToken, setAccessToken] = useState(null); // kept for API compatibility; always null in mock auth
  const [loading, setLoading] = useState(true); // initial auth bootstrap
  const [error, setError] = useState(null);

  // Avoid setting state after unmount during async bootstrap/login flows.
  const aliveRef = useRef(true);

  /**
   * Keep exposing an api client so the rest of the app doesn't change.
   * In mock mode, the api client will have no token. Consumers may still
   * use it for non-auth endpoints later.
   */
  const api = useMemo(
    () =>
      createApiClient({
        getAccessToken: () => null,
      }),
    []
  );

  const clearSession = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setError(null);
    safeWriteSession(null);
  }, []);

  const persistSession = useCallback((session) => {
    setUser(session);
    setAccessToken(null);
    safeWriteSession(session);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setError(null);

    const e = String(email || "").trim().toLowerCase();
    const p = String(password || "");

    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === e && u.password === p
    );

    if (!found) {
      const msg = "Invalid email or password.";
      setError(msg);
      const err = new Error(msg);
      err.code = "AUTH_INVALID_CREDENTIALS";
      return Promise.reject(err);
    }

    const session = { email: found.email, role: found.role, name: found.name };
    persistSession(session);
    return true;
  }, [persistSession]);

  const logout = useCallback(async () => {
    setError(null);
    clearSession();
  }, [clearSession]);

  const refreshMe = useCallback(async () => {
    /**
     * In mock auth mode there is no backend to refresh from.
     * We simply return current user (or restored session if available).
     */
    const restored = safeReadSession();
    if (restored) {
      setUser(restored);
      return restored;
    }
    return user;
  }, [user]);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  // Bootstrap auth from localStorage session.
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      const restored = safeReadSession();

      if (!aliveRef.current) return;

      if (restored) {
        setUser(restored);
        setAccessToken(null);
      } else {
        setUser(null);
        setAccessToken(null);
      }

      setLoading(false);
    })();
  }, []);

  const value = useMemo(
    () => ({
      user,
      accessToken, // kept for backwards compatibility (always null in mock)
      isAuthenticated: Boolean(user),
      loading,
      error,
      api, // exposed so pages can reuse the client

      // PUBLIC_INTERFACE
      login,
      // PUBLIC_INTERFACE
      logout,
      // PUBLIC_INTERFACE
      refreshMe,
      // PUBLIC_INTERFACE
      clearSession,
    }),
    [user, accessToken, loading, error, api, login, logout, refreshMe, clearSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth state and actions (login/logout/me) from AuthProvider. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
