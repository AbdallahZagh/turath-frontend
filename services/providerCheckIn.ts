import type { TouristBooking } from "@/lib/mock/bookings";
import {
  listProviderDeskArrivals,
  verifyProviderDeskCode,
  type ProviderCheckInResult,
  type ProviderDeskBooking,
} from "@/lib/mock/providerCheckIn";
import {
  checkInTouristBookingByBackupCode,
  listTouristBookings,
} from "@/services/bookings";
import type { ProviderCategory } from "@/lib/validation/auth";

function partySize(booking: TouristBooking): number {
  if (booking.type === "hotel") return booking.guests;
  if (booking.type === "restaurant") return booking.partySize;
  if (booking.type === "trip") return booking.seats;
  if (booking.type === "event") return booking.quantity;
  return 1;
}

function schedule(booking: TouristBooking): string {
  if (booking.type === "hotel") return `${booking.checkIn}T14:00:00+03:00`;
  if (booking.type === "restaurant") return `${booking.date}T${booking.timeSlot}:00+03:00`;
  if (booking.type === "event") return `${booking.date}T${booking.startsAt}:00+03:00`;
  return `${booking.date}T09:00:00+03:00`;
}

function toDeskBooking(booking: TouristBooking): ProviderDeskBooking {
  return {
    id: booking.id,
    reference: booking.reference,
    backupCode: booking.backupCode,
    guestName: { en: "Rami Haddad", ar: "رامي حداد" },
    phone: "+963 944 123 456",
    category: booking.type,
    schedule: schedule(booking),
    partySize: partySize(booking),
    listPriceSyp: booking.listPriceSyp,
    discountSyp: booking.discountSyp,
    cashDueSyp: booking.cashDueSyp,
    couponCode: booking.couponCode,
    status: "checkedIn",
    checkedInAt: booking.checkedInAt ?? new Date().toISOString(),
    checkedInBy: booking.checkedInBy ?? null,
  };
}

function providerCategory(booking: TouristBooking): ProviderCategory {
  if (booking.type === "hotel") return "hotels";
  if (booking.type === "restaurant") return "dining";
  if (booking.type === "trip") return "trips";
  if (booking.type === "event") return "events";
  return "guides";
}

export async function listProviderArrivals(category: ProviderCategory): Promise<ProviderDeskBooking[]> {
  return listProviderDeskArrivals(category);
}

export async function verifyProviderCheckInCode(input: {
  code: string;
  staffName: string;
  category: ProviderCategory;
}): Promise<ProviderCheckInResult> {
  const local = verifyProviderDeskCode(input.code, input.staffName, input.category);
  if (local.kind !== "invalid") return local;

  const touristBooking = (await listTouristBookings()).find(
    (booking) => booking.backupCode.toUpperCase() === input.code.trim().toUpperCase(),
  );
  if (!touristBooking || providerCategory(touristBooking) !== input.category) {
    return { kind: "invalid" };
  }

  const tourist = await checkInTouristBookingByBackupCode(
    input.code,
    input.staffName,
  );
  if (tourist.kind === "notFound") return { kind: "invalid" };
  return {
    kind: tourist.kind === "checkedIn" ? "success" : "alreadyUsed",
    booking: toDeskBooking(tourist.booking),
  };
}
