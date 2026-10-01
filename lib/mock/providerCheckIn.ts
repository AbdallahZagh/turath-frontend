import type { LocalizedName } from "@/lib/i18n/localized";
import type { TouristBookingStatus } from "@/lib/mock/bookings";
import {
  getProviderBookingByBackupCode,
  listProviderBookings,
  updateProviderBookingStatus,
  type ProviderBooking,
} from "@/lib/mock/providerBookings";
import type { ProviderCategory } from "@/lib/validation/auth";

export type ProviderDeskBooking = {
  id: string;
  reference: string;
  backupCode: string;
  guestName: LocalizedName;
  phone: string;
  category: "hotel" | "restaurant" | "trip" | "event" | "guide";
  schedule: string;
  partySize: number;
  listPriceSyp: number;
  discountSyp: number;
  cashDueSyp: number;
  couponCode: string | null;
  status: "confirmed" | "checkedIn";
  checkedInAt: string | null;
  checkedInBy: string | null;
};

/** What the desk does with a backup code, by booking status. A used pass is never accepted twice. */
const DESK_OUTCOME: Record<TouristBookingStatus, "checkIn" | "alreadyUsed" | "invalid"> = {
  PENDING_CONFIRMATION: "checkIn",
  CONFIRMED: "checkIn",
  CHECKED_IN: "alreadyUsed",
  COMPLETED: "alreadyUsed",
  CANCELLED: "invalid",
  NO_SHOW: "invalid",
  DISPUTED: "invalid",
};

export type ProviderCheckInResult =
  | { kind: "invalid" }
  | { kind: "success"; booking: ProviderDeskBooking }
  | { kind: "alreadyUsed"; booking: ProviderDeskBooking };

function toDeskBooking(booking: ProviderBooking, status: ProviderDeskBooking["status"]): ProviderDeskBooking {
  const category = booking.category === "dining" ? "restaurant" : booking.category.slice(0, -1) as ProviderDeskBooking["category"];
  return {
    id: booking.id,
    reference: booking.reference,
    backupCode: booking.backupCode,
    guestName: { ...booking.guestName },
    phone: booking.phone,
    category,
    schedule: booking.scheduledAt,
    partySize: booking.partySize,
    listPriceSyp: booking.listPriceSyp,
    discountSyp: booking.discountSyp,
    cashDueSyp: booking.cashDueSyp,
    couponCode: booking.couponCode,
    status,
    checkedInAt: booking.checkedInAt,
    checkedInBy: booking.checkedInBy,
  };
}

export function listProviderDeskArrivals(category: ProviderCategory = "hotels"): ProviderDeskBooking[] {
  return listProviderBookings(category)
    .filter((booking) => booking.status === "CONFIRMED")
    .map((booking) => toDeskBooking(booking, "confirmed"));
}

export function verifyProviderDeskCode(
  rawCode: string,
  staffName: string,
  category: ProviderCategory,
): ProviderCheckInResult {
  const booking = getProviderBookingByBackupCode(rawCode);
  if (!booking || booking.category !== category) return { kind: "invalid" };
  const outcome = DESK_OUTCOME[booking.status];
  if (outcome === "alreadyUsed") {
    return { kind: "alreadyUsed", booking: toDeskBooking(booking, "checkedIn") };
  }
  if (outcome === "invalid") return { kind: "invalid" };

  const checkedIn = updateProviderBookingStatus(booking.id, "CHECKED_IN", staffName);
  return { kind: "success", booking: toDeskBooking(checkedIn, "checkedIn") };
}
