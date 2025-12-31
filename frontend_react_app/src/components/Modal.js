import React, { useEffect } from "react";

// PUBLIC_INTERFACE
export function Modal({ open, title, children, onClose, footer, className = "" }) {
  /** Accessible modal dialog with overlay. */
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => onClose?.()}
        aria-hidden="true"
      />
      <div className="absolute inset-0 p-4 flex items-center justify-center">
        <div
          className={[
            "w-[min(720px,calc(100vw-2rem))] rounded-2xl bg-white shadow-card border border-gray-100",
            className,
          ].join(" ")}
          role="dialog"
          aria-modal="true"
          aria-label={title || "Dialog"}
          onClick={(e) => e.stopPropagation()}
        >
          {(title || onClose) && (
            <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3">
              <div className="min-w-0">
                {title && <div className="text-base font-extrabold text-brand-text">{title}</div>}
              </div>
              <button
                className="text-gray-600 hover:text-gray-900 font-bold"
                onClick={() => onClose?.()}
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>
          )}

          <div className="px-5 py-4">{children}</div>

          {footer && <div className="px-5 py-4 border-t border-gray-100">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
