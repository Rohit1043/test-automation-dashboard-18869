import React from "react";
import { useToast } from "../context/ToastContext";

const VARIANT_STYLES = {
  info: "border-blue-200 bg-blue-50 text-blue-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-red-200 bg-red-50 text-red-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
};

// PUBLIC_INTERFACE
export function ToastHost() {
  /** Renders toast notifications from ToastContext. */
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-16 right-4 z-50 space-y-2 w-[min(380px,calc(100vw-2rem))]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            "rounded-xl border px-4 py-3 shadow-card",
            VARIANT_STYLES[t.variant] || VARIANT_STYLES.info,
          ].join(" ")}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-extrabold truncate">{t.title}</div>
              {t.message && <div className="text-sm mt-0.5 text-current/80">{t.message}</div>}
            </div>
            <button
              className="text-current/70 hover:text-current font-bold"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss toast"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
