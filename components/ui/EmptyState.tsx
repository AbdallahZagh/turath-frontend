import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps): ReactNode {
  return (
    <GlassPanel
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-16 text-center",
        className,
      )}
    >
      <Icon className="text-accent size-8" aria-hidden />
      <h2 className="font-heading text-prose text-lg font-semibold">{title}</h2>
      <p className="text-prose-muted max-w-sm text-sm leading-relaxed">{description}</p>
      {action}
    </GlassPanel>
  );
}
