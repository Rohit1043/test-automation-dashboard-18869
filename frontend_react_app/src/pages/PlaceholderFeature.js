import React from "react";
import { Card } from "../components/Card";

// PUBLIC_INTERFACE
export function PlaceholderFeature({ title, description, bullets }) {
  /** Reusable placeholder content for feature sections not yet implemented. */
  const safeDescription =
    description ===
    "Mock a refinement run that converts raw requirements into test-ready content."
      ? ""
      : description;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-subtle-gradient border border-blue-900/10 px-5 py-4">
        <h1 className="text-lg font-extrabold text-brand-text">{title}</h1>
        {safeDescription ? (
          <p className="text-sm text-gray-700 mt-1">{safeDescription}</p>
        ) : null}
      </div>

      <Card title="Coming soon" subtitle="This section is currently mocked">
        <div className="text-sm text-gray-700 space-y-3">
          <p>
            This UI is intentionally front-end only for now. Backend integration will be added in a later step.
          </p>
          {bullets && bullets.length > 0 && (
            <ul className="list-disc pl-5 space-y-1">
              {bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}
