import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type BadgeVariant = "solid" | "glass" | "outline";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: ReactNode;
  className?: string;
};

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  solid: "bg-primary text-primary-foreground",
  glass: "glass-surface backdrop-blur-sm text-prose",
  outline: "border border-border text-prose-muted",
};

export function Badge({
  children,
  variant = "glass",
  icon,
  className,
}: BadgeProps): ReactNode {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
