import React from "react";

const VARIANTS = {
  primary:
    "bg-brand-primary text-white hover:bg-blue-800 focus:ring-brand-primary/30",
  secondary:
    "bg-brand-secondary text-white hover:bg-amber-500 focus:ring-brand-secondary/30",
  ghost:
    "bg-white text-brand-text hover:bg-gray-50 border border-gray-200 focus:ring-blue-900/10",
  danger: "bg-brand-error text-white hover:bg-red-700 focus:ring-red-500/20",
};

// PUBLIC_INTERFACE
export function Button({
  as: As = "button",
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  /** Themed button with variants and sizes. */
  const sizeCls =
    size === "sm"
      ? "px-3 py-1.5 text-sm"
      : size === "lg"
      ? "px-5 py-3 text-sm"
      : "px-4 py-2 text-sm";

  return (
    <As
      className={[
        "inline-flex items-center justify-center rounded-lg font-semibold transition",
        "focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANTS[variant] || VARIANTS.primary,
        sizeCls,
        className,
      ].join(" ")}
      {...props}
    />
  );
}
