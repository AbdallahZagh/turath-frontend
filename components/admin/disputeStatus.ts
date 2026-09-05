import type { BadgeVariant } from "@/components/ui/Badge";
import type { DisputeStatus } from "@/lib/mock/adminDisputes";

export function disputeStatusBadgeProps(status: DisputeStatus): {
  variant: BadgeVariant;
  className?: string;
} {
  if (status === "open") {
    return { variant: "glass", className: "text-accent" };
  }
  if (status === "resolvedGuest") {
    return { variant: "solid" };
  }
  return { variant: "outline", className: "text-destructive border-destructive" };
}
