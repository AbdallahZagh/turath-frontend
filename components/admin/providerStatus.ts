import type { BadgeVariant } from "@/components/ui/Badge";
import type { ProviderStatus } from "@/lib/mock/adminProviders";

export function providerStatusBadgeProps(status: ProviderStatus): {
  variant: BadgeVariant;
  className?: string;
} {
  if (status === "approved") {
    return { variant: "solid" };
  }
  if (status === "pending") {
    return { variant: "glass", className: "text-accent" };
  }
  return { variant: "outline", className: "text-destructive border-destructive" };
}
