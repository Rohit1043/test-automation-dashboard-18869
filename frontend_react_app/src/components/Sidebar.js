import React from "react";
import { useUI } from "../context/UIContext";
import { IconNavItem } from "./IconNavItem";

const Icon = ({ pathD }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d={pathD} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// PUBLIC_INTERFACE
export function Sidebar() {
  /** Left sidebar navigation for main sections. */
  const { sidebarCollapsed, toggleSidebar } = useUI();

  return (
    <aside
      className={[
        "bg-brand-surface border-r border-gray-100",
        "h-screen sticky top-0",
        sidebarCollapsed ? "w-16" : "w-64",
        "hidden md:flex flex-col transition-all duration-200",
      ].join(" ")}
    >
      <div className="h-14 flex items-center justify-between px-3 border-b border-gray-100">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-subtle-gradient border border-blue-900/10 flex items-center justify-center shrink-0">
            <span className="text-brand-primary font-extrabold">TA</span>
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-brand-text truncate">
                Dashboard
              </div>
              <div className="text-xs text-gray-600 truncate">Classic theme</div>
            </div>
          )}
        </div>

        <button
          className="p-2 rounded-lg hover:bg-gray-50 text-gray-700"
          onClick={toggleSidebar}
          aria-label="Collapse sidebar"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
            <path
              d={sidebarCollapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <nav className="px-2 py-3 flex-1 space-y-1">
        <IconNavItem
          to="/"
          icon={<Icon pathD="M4 10.5l8-7 8 7V20a1 1 0 0 1-1 1h-5v-7H10v7H5a1 1 0 0 1-1-1v-9.5z" />}
          label="Home"
          collapsed={sidebarCollapsed}
        />
        <IconNavItem
          to="/requirements"
          icon={<Icon pathD="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />}
          label="Refine Requirements"
          collapsed={sidebarCollapsed}
        />
        <IconNavItem
          to="/test-cases"
          icon={<Icon pathD="M9 11l3 3L22 4M2 12l5 5L17 7" />}
          label="Generate Test Cases"
          collapsed={sidebarCollapsed}
        />
        <IconNavItem
          to="/test-scripts"
          icon={<Icon pathD="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5" />}
          label="Generate Test Scripts"
          collapsed={sidebarCollapsed}
        />
        <IconNavItem
          to="/execute"
          icon={<Icon pathD="M8 5v14l11-7L8 5z" />}
          label="Execute Tests"
          collapsed={sidebarCollapsed}
        />
        <IconNavItem
          to="/reports"
          icon={<Icon pathD="M4 19V5m0 14h16M8 15V9m4 6V7m4 8v-5" />}
          label="Reports"
          collapsed={sidebarCollapsed}
        />
        <div className="pt-3 mt-3 border-t border-gray-100">
          <IconNavItem
            to="/auth"
            icon={<Icon pathD="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm7 10a7 7 0 0 0-14 0" />}
            label="Auth (Mock)"
            collapsed={sidebarCollapsed}
          />
        </div>
      </nav>

      <div className="px-3 py-3 text-xs text-gray-500 border-t border-gray-100">
        {!sidebarCollapsed ? (
          <div>
            <div className="font-semibold text-gray-700">Env-aware</div>
            <div>Config via REACT_APP_*</div>
          </div>
        ) : (
          <div className="text-center">•</div>
        )}
      </div>
    </aside>
  );
}
