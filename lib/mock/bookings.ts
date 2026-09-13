import { addDays, subDays } from "date-fns";

import { toIsoDate } from "@/lib/format/datetime";

export type TouristBookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CANCELLED"
  | "NO_SHOW";

export type HotelBooking = {
  id: string;
  reference: string;
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests: string;
  nights: number;
  listPriceSyp: number;
  discountSyp: number;
  cashDueSyp: number;
  couponCode: string | null;
  status: TouristBookingStatus;
  backupCode: string;
  qrPayload: string;
  createdAt: string;
};

export type CreateHotelBookingInput = Omit<
  HotelBooking,
  "id" | "reference" | "status" | "backupCode" | "qrPayload" | "createdAt"
>;

export type CouponResult =
  | { valid: true; code: string; percent: number }
  | { valid: false; reason: "empty" | "invalid" };

export type TouristBookingReview = {
  bookingId: string;
  rating: number;
  comment: string;
  submittedAt: string;
};

function demoBooking(
  id: string,
  hotelId: string,
  roomId: string,
  startOffset: number,
  nights: number,
  status: TouristBookingStatus,
  priceSyp: number,
): HotelBooking {
  const now = new Date();
  const checkInDate = startOffset >= 0
    ? addDays(now, startOffset)
    : subDays(now, Math.abs(startOffset));
  const reference = `TRH-${id.slice(-6).toUpperCase()}`;
  const backupCode = id.slice(-6).toUpperCase();
  return {
    id,
    reference,
    hotelId,
    roomId,
    checkIn: toIsoDate(checkInDate),
    checkOut: toIsoDate(addDays(checkInDate, nights)),
    guests: 2,
    specialRequests: "",
    nights,
    listPriceSyp: priceSyp,
    discountSyp: 0,
    cashDueSyp: priceSyp,
    couponCode: null,
    status,
    backupCode,
    qrPayload: JSON.stringify({ bookingId: id, reference, backupCode }),
    createdAt: subDays(now, 14).toISOString(),
  };
}

export function listMockTouristBookings(): HotelBooking[] {
  return [
    demoBooking("demo-upcoming", "dar-al-yasmin", "yasmin-double", 12, 2, "CONFIRMED", 480000),
    demoBooking("demo-checked", "citadel-stone-house", "citadel-double", -18, 2, "CHECKED_IN", 420000),
    demoBooking("demo-cancel", "blue-coast-terrace", "coast-double", -42, 1, "CANCELLED", 195000),
  ];
}

export function validateMockHotelCoupon(code: string): CouponResult {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { valid: false, reason: "empty" };
  if (normalized === "TURATH10") return { valid: true, code: normalized, percent: 10 };
  return { valid: false, reason: "invalid" };
}
