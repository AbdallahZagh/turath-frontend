import type { BadgeVariant } from "@/components/ui/Badge";
import type { BookingStatus } from "@/lib/mock/adminBookings";

export function bookingStatusBadgeProps(status: BookingStatus): {
  variant: BadgeVariant;
  className?: string;
} {
  if (status === "checkedIn" || status === "completed") {
    return { variant: "solid" };
  }
  if (status === "confirmed" || status === "pending") {
    return { variant: "glass", className: "text-accent" };
  }
  return { variant: "outline", className: "text-destructive border-destructive" };
}
