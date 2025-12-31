import React from "react";
import { PlaceholderFeature } from "./PlaceholderFeature";

// PUBLIC_INTERFACE
export function ExecuteTests() {
  /** Placeholder page for Execute Tests. */
  return (
    <PlaceholderFeature
      title="Execute Tests"
      description="Run tests, observe progress, and stream logs (future WebSocket integration)."
      bullets={[
        "Queue runs and view status",
        "Live logs via REACT_APP_WS_URL (future)",
        "Artifacts and retries (future)",
      ]}
    />
  );
}
