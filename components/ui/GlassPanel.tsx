import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Backdrop blur. Off inside overflow scrollers so the page fill is not clipped into bands. */
  frost?: boolean;
};

export function GlassPanel({
  children,
  className,
  id,
  frost = true,
}: GlassPanelProps): ReactNode {
  return (
    <div
      id={id}
      className={cn(
        "glass-surface relative flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden rounded-glass",
        frost && "glass-frost backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
