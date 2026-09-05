import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps): ReactNode {
  return (
    <div
      aria-hidden
      className={cn("bg-glass-control backdrop-blur-sm animate-pulse rounded-glass", className)}
    />
  );
}
