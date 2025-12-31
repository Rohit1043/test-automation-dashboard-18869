import React from "react";
import { PlaceholderFeature } from "./PlaceholderFeature";

// PUBLIC_INTERFACE
export function Reports() {
  /** Placeholder page for Reports. */
  return (
    <PlaceholderFeature
      title="Reports"
      description="View summaries, trends, and detailed results from executed test runs."
      bullets={[
        "Pass/fail dashboards",
        "Downloadable reports (future)",
        "Filter by suite, environment, time range (future)",
      ]}
    />
  );
}
