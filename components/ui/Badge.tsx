import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type BadgeVariant = "solid" | "glass" | "outline" | "warning";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: ReactNode;
  className?: string;
  /** Short explanation: a hover tooltip, and read after the label by screen readers. */
  tooltip?: string;
};

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  solid: "bg-primary text-primary-foreground",
  glass: "glass-surface backdrop-blur-sm text-prose",
  outline: "border border-border text-prose-muted",
  // Amber tint with dark amber text (light amber in dark mode), the warning toast colours.
  warning: "border border-toast-warning-border bg-toast-warning text-toast-warning-foreground",
};

export function Badge({
  children,
  variant = "glass",
  icon,
  className,
  tooltip,
}: BadgeProps): ReactNode {
  return (
    <span
      title={tooltip}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {icon}
      {children}
      {tooltip ? <span className="sr-only">: {tooltip}</span> : null}
    </span>
  );
}
