import React from "react";

// PUBLIC_INTERFACE
export function ProgressBar({ value = 0, label, className = "" }) {
  /** Themed progress bar (0..100) used for mocked long-running actions. */
  const v = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className={["space-y-1", className].join(" ")}>
      <div className="flex items-center justify-between gap-3">
        {label ? (
          <div className="text-xs font-semibold text-gray-700">{label}</div>
        ) : (
          <span />
        )}
        <div className="text-xs font-semibold text-gray-700">{v}%</div>
      </div>
      <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
        <div
          className="h-2.5 rounded-full bg-brand-primary transition-[width] duration-150"
          style={{ width: `${v}%` }}
          aria-valuenow={v}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>
    </div>
  );
}
