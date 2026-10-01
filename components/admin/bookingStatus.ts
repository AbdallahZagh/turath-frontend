import {
  bookingStatusBadge,
  type BookingStatusBadgeProps,
} from "@/components/bookings/bookingStatusBadge";
import type { BookingStatus } from "@/lib/mock/adminBookings";
import type { TouristBookingStatus } from "@/lib/mock/bookings";

/** Admin rows use lower-case status ids; each maps to the one shared booking status. */
const ADMIN_TO_BOOKING_STATUS: Record<BookingStatus, TouristBookingStatus> = {
  pending: "PENDING_CONFIRMATION",
  confirmed: "CONFIRMED",
  checkedIn: "CHECKED_IN",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
  noShow: "NO_SHOW",
  disputed: "DISPUTED",
};

export function bookingStatusBadgeProps(status: BookingStatus): BookingStatusBadgeProps {
  return bookingStatusBadge(ADMIN_TO_BOOKING_STATUS[status]);
}
