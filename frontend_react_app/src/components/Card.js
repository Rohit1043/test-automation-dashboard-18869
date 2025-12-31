import React from "react";

// PUBLIC_INTERFACE
export function Card({ title, subtitle, actions, children, className = "" }) {
  /** Surface card with optional header area. */
  return (
    <div className={["rounded-xl bg-brand-surface shadow-card border border-gray-100", className].join(" ")}>
      {(title || subtitle || actions) && (
        <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-base font-bold text-brand-text">{title}</h2>}
            {subtitle && <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}
