import type { ReactNode } from "react";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/cn";

export type BarListRow = {
  id: string;
  label: string;
  hint?: string;
  display: string;
  ratio: number;
};

type BarListProps = {
  rows: BarListRow[];
  className?: string;
};

export function BarList({ rows, className }: BarListProps): ReactNode {
  return (
    <ul className={cn("flex flex-col gap-4", className)}>
      {rows.map((row) => (
        <li key={row.id} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <div className="min-w-0">
              <p className="text-prose truncate text-sm font-medium">{row.label}</p>
              {row.hint ? (
                <p className="text-prose-muted text-xs">{row.hint}</p>
              ) : null}
            </div>
            <span className="text-prose shrink-0 text-sm font-semibold tabular-nums">
              {row.display}
            </span>
          </div>
          <div className="bg-glass-control backdrop-blur-sm h-2 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full"
              style={{ width: `${Math.max(row.ratio * 100, 2)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

type ChartCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function ChartCard({ title, children, className }: ChartCardProps): ReactNode {
  return (
    <GlassPanel className={cn("flex flex-col gap-5 p-5 sm:p-6", className)}>
      <h2 className="font-heading text-prose text-lg font-semibold">{title}</h2>
      {children}
    </GlassPanel>
  );
}
