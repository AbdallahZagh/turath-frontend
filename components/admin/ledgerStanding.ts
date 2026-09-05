import type { BadgeVariant } from "@/components/ui/Badge";
import {
  CREDIT_GRACE_RATIO,
  CREDIT_WATCH_RATIO,
  type LedgerStanding,
} from "@/lib/mock/adminLedger";

export function ledgerStandingBadgeProps(standing: LedgerStanding): {
  variant: BadgeVariant;
  className?: string;
} {
  if (standing === "healthy") {
    return { variant: "solid" };
  }
  if (standing === "watch") {
    return { variant: "glass", className: "text-accent" };
  }
  return { variant: "outline", className: "text-destructive border-destructive" };
}

export function creditUsedClass(ratio: number): string {
  if (ratio >= CREDIT_GRACE_RATIO) {
    return "text-destructive";
  }
  if (ratio >= CREDIT_WATCH_RATIO) {
    return "text-accent";
  }
  return "text-prose";
}

export function creditBarClass(ratio: number): string {
  if (ratio >= CREDIT_GRACE_RATIO) {
    return "bg-destructive";
  }
  if (ratio >= CREDIT_WATCH_RATIO) {
    return "bg-accent";
  }
  return "bg-primary";
}
