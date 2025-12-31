import React from "react";

// PUBLIC_INTERFACE
export function Tabs({ tabs, activeKey, onChange }) {
  /** Simple tabs for in-page navigation. */
  return (
    <div className="flex items-center gap-2 border-b border-gray-100">
      {tabs.map((t) => {
        const active = t.key === activeKey;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={[
              "px-3 py-2 text-sm font-semibold rounded-t-lg transition",
              active ? "text-brand-primary bg-blue-900/10" : "text-gray-600 hover:text-brand-primary hover:bg-gray-50",
            ].join(" ")}
            aria-current={active ? "page" : undefined}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
