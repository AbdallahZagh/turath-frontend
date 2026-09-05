import { TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/cn";

type ErrorStateProps = {
  title: string;
  description: string;
  retryLabel: string;
  onRetry: () => void;
  className?: string;
};

export function ErrorState({
  title,
  description,
  retryLabel,
  onRetry,
  className,
}: ErrorStateProps): ReactNode {
  return (
    <GlassPanel
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-16 text-center",
        className,
      )}
    >
      <TriangleAlert className="text-accent size-8" aria-hidden />
      <h2 className="font-heading text-prose text-lg font-semibold">{title}</h2>
      <p className="text-prose-muted max-w-sm text-sm leading-relaxed">{description}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        {retryLabel}
      </Button>
    </GlassPanel>
  );
}
