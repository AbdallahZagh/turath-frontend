"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/cn";

type ListingFiltersPanelProps = {
  title: string;
  resetLabel: string;
  onReset: () => void;
  /** Skip the outer GlassPanel, title and sticky chrome (inside the mobile filters Drawer). */
  embedded?: boolean;
  className?: string;
  children: ReactNode;
};

/** Frame shared by every listing's filter fields: the sticky side panel, or bare inside the Drawer. */
export function ListingFiltersPanel({
  title,
  resetLabel,
  onReset,
  embedded = false,
  className,
  children,
}: ListingFiltersPanelProps): ReactNode {
  if (embedded) {
    return <div className={className}>{children}</div>;
  }

  return (
    <GlassPanel className={cn("p-5 lg:sticky lg:top-28", className)}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-heading text-prose flex items-center gap-2 text-lg font-semibold">
          <SlidersHorizontal className="text-accent size-5" aria-hidden />
          {title}
        </h2>
        <Button variant="glass" size="sm" className="shrink-0 whitespace-nowrap" onClick={onReset}>
          <RotateCcw className="size-3.5" aria-hidden />
          {resetLabel}
        </Button>
      </div>
      {children}
    </GlassPanel>
  );
}
