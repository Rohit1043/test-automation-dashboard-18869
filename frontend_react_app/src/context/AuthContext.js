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

const STORAGE_KEY = "ta_access_token";

const normalizeUser = (raw) => {
  if (!raw) return null;
  // Support a few common shapes returned by backends.
  return {
    id: raw.id || raw.user_id || raw.sub || raw.uid || "unknown",
    name: raw.name || raw.full_name || raw.username || raw.email || "User",
    email: raw.email || "",
    role: raw.role || raw.user_role || raw.scope || "user",
  };
};

const extractTokenFromLoginResponse = (data) => {
  if (!data) return null;
  // Support common token fields.
  return (
    data.access_token ||
    data.accessToken ||
    data.token ||
    (data.data && (data.data.access_token || data.data.token)) ||
    null
  );
};

const extractUserFromResponse = (data) => {
  if (!data) return null;
  // Support `user`, `me`, `profile`, etc.
  return data.user || data.me || data.profile || data.account || null;
};

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides real authentication state and actions backed by the configured backend. */
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true); // initial auth bootstrap
  const [error, setError] = useState(null);

  // Avoid setting state after unmount during async bootstrap/login flows.
  const aliveRef = useRef(true);

  const api = useMemo(
    () =>
      createApiClient({
        getAccessToken: () => accessToken,
      }),
    [accessToken]
  );

  const clearSession = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setError(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      // ignore storage failures (private mode, etc.)
    }
  }, []);

  const persistToken = useCallback((token) => {
    setAccessToken(token);
    try {
      if (token) window.localStorage.setItem(STORAGE_KEY, token);
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      // ignore
    }
  }, []);

  const refreshMe = useCallback(async () => {
    if (!accessToken) return null;
    const meResp = await api.authMe();
    const meRaw = extractUserFromResponse(meResp) || meResp;
    const me = normalizeUser(meRaw);
    setUser(me);
    return me;
  }, [api, accessToken]);

  const login = useCallback(
    async ({ email, password }) => {
      setError(null);
      const resp = await api.authLogin({ email, password });
      const token = extractTokenFromLoginResponse(resp);

      if (!token) {
        const e = new Error(
          "Login succeeded but no access token was returned by the backend."
        );
        e.data = resp;
        throw e;
      }

      persistToken(token);

      // Try to derive user from login response; fall back to /auth/me.
      const userRaw = extractUserFromResponse(resp);
      if (userRaw) {
        setUser(normalizeUser(userRaw));
      } else {
        await refreshMe();
      }

      return true;
    },
    [api, persistToken, refreshMe]
  );

  const logout = useCallback(async () => {
    setError(null);

    // Best-effort logout call; always clear session.
    try {
      if (accessToken) await api.authLogout();
    } catch (_e) {
      // ignore network/backend errors on logout
    } finally {
      clearSession();
    }
  }, [accessToken, api, clearSession]);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  // Bootstrap auth from localStorage token and validate via /auth/me.
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      let stored = null;
      try {
        stored = window.localStorage.getItem(STORAGE_KEY);
      } catch (_e) {
        stored = null;
      }

      if (!stored) {
        if (aliveRef.current) {
          setLoading(false);
          setUser(null);
          setAccessToken(null);
        }
        return;
      }

      if (aliveRef.current) setAccessToken(stored);

      try {
        // Validate token and load user.
        const meResp = await createApiClient({
          getAccessToken: () => stored,
        }).authMe();
        const meRaw = extractUserFromResponse(meResp) || meResp;

        if (aliveRef.current) {
          setUser(normalizeUser(meRaw));
          setLoading(false);
        }
      } catch (_e) {
        // Token invalid/expired.
        if (aliveRef.current) {
          clearSession();
          setLoading(false);
        }
      }
    })();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(user && accessToken),
      loading,
      error,
      api, // exposed so pages can reuse the authenticated client
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
