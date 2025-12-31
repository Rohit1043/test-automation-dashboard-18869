import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const UIContext = createContext(null);

// PUBLIC_INTERFACE
export function UIProvider({ children }) {
  /** Provides UI preferences such as sidebar collapse state. */
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((v) => !v);
  }, []);

  const value = useMemo(
    () => ({
      sidebarCollapsed,
      setSidebarCollapsed,
      toggleSidebar,
    }),
    [sidebarCollapsed, toggleSidebar]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

// PUBLIC_INTERFACE
export function useUI() {
  /** Hook to access UI state. */
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
