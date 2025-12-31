import { getRuntimeConfig } from "../config/runtimeConfig";

/**
 * Lightweight fetch-based API client.
 * - Uses runtime-configured base URL from REACT_APP_API_BASE/REACT_APP_BACKEND_URL
 * - Attaches Authorization header when an access token is available
 * - Provides helpers for common JSON request patterns
 */

// PUBLIC_INTERFACE
export function createApiClient({ getAccessToken } = {}) {
  /** Creates an API client using runtime config base URL and an optional access token getter. */
  const cfg = getRuntimeConfig();
  const baseUrl = (cfg.apiBase || "").replace(/\/+$/, "");

  const buildUrl = (path) => {
    if (!path) return baseUrl;
    if (/^https?:\/\//i.test(path)) return path;
    return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const parseJsonSafe = async (resp) => {
    const contentType = resp.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return null;
    try {
      return await resp.json();
    } catch (_e) {
      return null;
    }
  };

  const request = async (path, options = {}) => {
    const url = buildUrl(path);

    const token = typeof getAccessToken === "function" ? getAccessToken() : null;

    const headers = new Headers(options.headers || {});
    if (!headers.has("Accept")) headers.set("Accept", "application/json");

    // If body is a plain object, we JSON stringify it and set Content-Type.
    let body = options.body;
    if (
      body &&
      typeof body === "object" &&
      !(body instanceof FormData) &&
      !(body instanceof Blob) &&
      !(body instanceof ArrayBuffer)
    ) {
      if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
      body = JSON.stringify(body);
    }

    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const resp = await fetch(url, {
      ...options,
      headers,
      body,
      // cookies off by default; if your backend uses httpOnly session cookies, flip to "include"
      credentials: "same-origin",
    });

    const data = await parseJsonSafe(resp);

    if (!resp.ok) {
      const err = new Error(
        (data && (data.message || data.detail || data.error)) ||
          `Request failed (${resp.status})`
      );
      err.status = resp.status;
      err.data = data;
      throw err;
    }

    return data;
  };

  return {
    baseUrl,

    // PUBLIC_INTERFACE
    async get(path) {
      /** Performs a GET request returning parsed JSON (if any). */
      return request(path, { method: "GET" });
    },

    // PUBLIC_INTERFACE
    async post(path, body) {
      /** Performs a POST request returning parsed JSON (if any). */
      return request(path, { method: "POST", body });
    },

    // PUBLIC_INTERFACE
    async healthcheck() {
      /** Calls the backend healthcheck path from runtime config. */
      const { healthcheckPath } = getRuntimeConfig();
      return request(healthcheckPath || "/health", { method: "GET" });
    },

    // PUBLIC_INTERFACE
    async authLogin({ email, password }) {
      /** Logs in via POST /auth/login. Expected to return an access token and optional user payload. */
      return request("/auth/login", { method: "POST", body: { email, password } });
    },

    // PUBLIC_INTERFACE
    async authMe() {
      /** Fetches the current user via GET /auth/me using the attached Authorization bearer token. */
      return request("/auth/me", { method: "GET" });
    },

    // PUBLIC_INTERFACE
    async authLogout() {
      /** Logs out via POST /auth/logout (best-effort; token is also cleared client-side). */
      return request("/auth/logout", { method: "POST" });
    },
  };
}
