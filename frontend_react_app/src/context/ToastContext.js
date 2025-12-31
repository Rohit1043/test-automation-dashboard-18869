import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

const genId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

// PUBLIC_INTERFACE
export function ToastProvider({ children }) {
  /** Provides toast notification state and helpers. */
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((toast) => {
    const id = genId();
    const next = {
      id,
      title: toast.title || "Notice",
      message: toast.message || "",
      variant: toast.variant || "info", // info | success | error | warning
      timeoutMs: typeof toast.timeoutMs === "number" ? toast.timeoutMs : 3000,
    };

    setToasts((prev) => [...prev, next]);

    if (next.timeoutMs > 0) {
      window.setTimeout(() => dismiss(id), next.timeoutMs);
    }

    return id;
  }, [dismiss]);

  const value = useMemo(() => ({ toasts, push, dismiss }), [toasts, push, dismiss]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

// PUBLIC_INTERFACE
export function useToast() {
  /** Hook to push/dismiss toasts. */
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
