import type { LocalizedName } from "@/lib/i18n/localized";
import {
  getProviderBookingByBackupCode,
  listProviderBookings,
  updateProviderBookingStatus,
  type ProviderBooking,
} from "@/lib/mock/providerBookings";

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
  return {
    id: booking.id,
    reference: booking.reference,
    backupCode: booking.backupCode,
    guestName: { ...booking.guestName },
    phone: booking.phone,
    category: "hotel",
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

export function listProviderDeskArrivals(): ProviderDeskBooking[] {
  return listProviderBookings()
    .filter((booking) => booking.status === "CONFIRMED")
    .map(toDeskBooking);
}

export function verifyProviderDeskCode(
  rawCode: string,
  staffName: string,
): ProviderCheckInResult {
  const booking = getProviderBookingByBackupCode(rawCode);
  if (!booking) return { kind: "invalid" };
  if (booking.status === "CHECKED_IN") {
    return { kind: "alreadyUsed", booking: toDeskBooking(booking) };
  }
  if (booking.status !== "CONFIRMED" && booking.status !== "PENDING") {
    return { kind: "invalid" };
  }

  const checkedIn = updateProviderBookingStatus(booking.id, "CHECKED_IN", staffName);
  return { kind: "success", booking: toDeskBooking(checkedIn) };
}
