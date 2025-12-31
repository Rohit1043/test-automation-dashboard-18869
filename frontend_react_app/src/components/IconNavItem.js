import React from "react";
import { NavLink } from "react-router-dom";

// PUBLIC_INTERFACE
export function IconNavItem({ to, icon, label, collapsed = false }) {
  /** Sidebar navigation item with active state highlighting. */
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition",
          isActive
            ? "bg-blue-900/10 text-brand-primary"
            : "text-gray-700 hover:bg-gray-50 hover:text-brand-primary",
        ].join(" ")
      }
    >
      <span className="w-5 h-5 flex items-center justify-center text-brand-primary/90">
        {icon}
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}
