import { getRuntimeConfig } from "../config/runtimeConfig";

/**
 * Lightweight API client stub. No real network calls yet.
 * When backend integration is added, replace stubs with fetch/axios calls.
 */

// PUBLIC_INTERFACE
export function createApiClient() {
  /** Creates an API client using runtime config base URL. */
  const cfg = getRuntimeConfig();
  const baseUrl = cfg.apiBase;

  return {
    baseUrl,

    // PUBLIC_INTERFACE
    async healthcheck() {
      /** Placeholder healthcheck. */
      return { ok: true, baseUrl, note: "Stubbed client: no backend call performed." };
    },

    // PUBLIC_INTERFACE
    async listFiles() {
      /** Placeholder list files. Real implementation will fetch from backend. */
      return { ok: true, items: [], note: "Stubbed client: returning empty list." };
    },
  };
}
