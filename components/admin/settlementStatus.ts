import type { BadgeVariant } from "@/components/ui/Badge";
import type { SettlementStatus } from "@/lib/mock/adminLedger";

export function settlementStatusBadgeProps(status: SettlementStatus): {
  variant: BadgeVariant;
  className?: string;
} {
  if (status === "paid") {
    return { variant: "solid" };
  }
  if (status === "due") {
    return { variant: "glass", className: "text-accent" };
  }
  return { variant: "outline", className: "text-destructive border-destructive" };
}
