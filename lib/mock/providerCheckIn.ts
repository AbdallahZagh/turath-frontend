import type { LocalizedName } from "@/lib/i18n/localized";
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

export type ProviderCheckInResult =
  | { kind: "invalid" }
  | { kind: "success"; booking: ProviderDeskBooking }
  | { kind: "alreadyUsed"; booking: ProviderDeskBooking };

function toDeskBooking(booking: ProviderBooking): ProviderDeskBooking {
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
    status: booking.status === "CHECKED_IN" ? "checkedIn" : "confirmed",
    checkedInAt: booking.checkedInAt,
    checkedInBy: booking.checkedInBy,
  };
}

export function listProviderDeskArrivals(category: ProviderCategory = "hotels"): ProviderDeskBooking[] {
  return listProviderBookings(category)
    .filter((booking) => booking.status === "CONFIRMED")
    .map(toDeskBooking);
}

export function verifyProviderDeskCode(
  rawCode: string,
  staffName: string,
  category: ProviderCategory,
): ProviderCheckInResult {
  const booking = getProviderBookingByBackupCode(rawCode);
  if (!booking || booking.category !== category) return { kind: "invalid" };
  if (booking.status === "CHECKED_IN") {
    return { kind: "alreadyUsed", booking: toDeskBooking(booking) };
  }
  if (booking.status !== "CONFIRMED" && booking.status !== "PENDING_CONFIRMATION") {
    return { kind: "invalid" };
  }

  const checkedIn = updateProviderBookingStatus(booking.id, "CHECKED_IN", staffName);
  return { kind: "success", booking: toDeskBooking(checkedIn) };
}
