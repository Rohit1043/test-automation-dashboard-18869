/**
 * Runtime configuration loader for CRA environment variables.
 * Uses safe defaults so the app runs locally without any .env setup.
 */

const parseJsonSafe = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (_e) {
    return fallback;
  }
};

const parseBool = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  const v = String(value).toLowerCase().trim();
  return v === "true" || v === "1" || v === "yes" || v === "on";
};

// PUBLIC_INTERFACE
export function getRuntimeConfig() {
  /** Returns normalized runtime config from REACT_APP_* env vars with safe defaults. */
  const env = process.env || {};

  const featureFlagsRaw =
    env.REACT_APP_FEATURE_FLAGS ||
    '{"uploads":true,"reports":true,"execution":true,"scripts":true,"cases":true,"requirements":true}';

  return {
    apiBase: env.REACT_APP_API_BASE || env.REACT_APP_BACKEND_URL || "http://localhost:8000",
    backendUrl: env.REACT_APP_BACKEND_URL || env.REACT_APP_API_BASE || "http://localhost:8000",
    frontendUrl: env.REACT_APP_FRONTEND_URL || "http://localhost:3000",
    wsUrl: env.REACT_APP_WS_URL || "ws://localhost:8000/ws",
    nodeEnv: env.REACT_APP_NODE_ENV || env.NODE_ENV || "development",
    nextTelemetryDisabled: parseBool(env.REACT_APP_NEXT_TELEMETRY_DISABLED, true),
    enableSourceMaps: parseBool(env.REACT_APP_ENABLE_SOURCE_MAPS, true),
    port: env.REACT_APP_PORT || "3000",
    trustProxy: parseBool(env.REACT_APP_TRUST_PROXY, false),
    logLevel: env.REACT_APP_LOG_LEVEL || "info",
    healthcheckPath: env.REACT_APP_HEALTHCHECK_PATH || "/health",
    featureFlags: parseJsonSafe(featureFlagsRaw, {}),
    experimentsEnabled: parseBool(env.REACT_APP_EXPERIMENTS_ENABLED, false),
  };
}

// PUBLIC_INTERFACE
export function isFeatureEnabled(flagName, config = getRuntimeConfig()) {
  /** Checks if a given feature flag is enabled. Missing flags default to false. */
  if (!flagName) return false;
  return Boolean(config.featureFlags && config.featureFlags[flagName]);
}
