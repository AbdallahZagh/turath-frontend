import type { BadgeVariant } from "@/components/ui/Badge";
import type { TouristBookingStatus } from "@/lib/mock/bookings";

export type BookingStatusBadgeProps = {
  variant: BadgeVariant;
  className?: string;
};

const ACTIVE: BookingStatusBadgeProps = { variant: "glass", className: "text-accent" };
const ARRIVED: BookingStatusBadgeProps = { variant: "solid" };
const ENDED: BookingStatusBadgeProps = {
  variant: "outline",
  className: "border-destructive text-destructive",
};
const NEEDS_REVIEW: BookingStatusBadgeProps = { variant: "warning" };

/** One badge colour per booking status, shared by the user, business and admin portals. */
const BOOKING_STATUS_BADGES: Record<TouristBookingStatus, BookingStatusBadgeProps> = {
  PENDING_CONFIRMATION: ACTIVE,
  CONFIRMED: ACTIVE,
  CHECKED_IN: ARRIVED,
  COMPLETED: ARRIVED,
  CANCELLED: ENDED,
  NO_SHOW: ENDED,
  DISPUTED: NEEDS_REVIEW,
};

export function bookingStatusBadge(status: TouristBookingStatus): BookingStatusBadgeProps {
  return BOOKING_STATUS_BADGES[status];
}
