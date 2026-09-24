import { addDays, subDays } from "date-fns";

import { toIsoDate } from "@/lib/format/datetime";
import type { CouponBookingType } from "@/lib/mock/couponTargets";

export type TouristBookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CANCELLED"
  | "NO_SHOW";

type BookingReceipt = {
  id: string;
  reference: string;
  type: "hotel" | "restaurant" | "trip" | "event" | "guide";
  listPriceSyp: number;
  discountSyp: number;
  cashDueSyp: number;
  couponCode: string | null;
  status: TouristBookingStatus;
  backupCode: string;
  qrPayload: string;
  createdAt: string;
  checkedInAt?: string;
  checkedInBy?: string;
};

export type HotelBooking = BookingReceipt & {
  type: "hotel";
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests: string;
  nights: number;
};

export type RestaurantBooking = BookingReceipt & {
  type: "restaurant";
  restaurantId: string;
  date: string;
  timeSlot: string;
  partySize: number;
  zoneId: "indoor" | "terrace" | "vip" | "smoking";
  specialRequests: string;
};

export type TripBooking = BookingReceipt & {
  type: "trip";
  tripId: string;
  date: string;
  seats: number;
  pickupPointId: string;
  emergencyContact: string;
};

export type EventBooking = BookingReceipt & {
  type: "event";
  eventId: string;
  sessionId: string;
  ticketTier: "standard" | "vip";
  quantity: number;
  date: string;
  startsAt: string;
};

export type GuideBooking = BookingReceipt & {
  type: "guide";
  guideId: string;
  date: string;
  duration: "hourly" | "halfDay" | "fullDay";
  hours: number;
  language: "arabic" | "english" | "french" | "german";
  focusArea: "history" | "architecture" | "food" | "photography" | "hiking";
};

export type TouristBooking = HotelBooking | RestaurantBooking | TripBooking | EventBooking | GuideBooking;

export type CreateHotelBookingInput = Omit<
  HotelBooking,
  "id" | "reference" | "type" | "status" | "backupCode" | "qrPayload" | "createdAt"
>;

export type CreateRestaurantBookingInput = Omit<
  RestaurantBooking,
  "id" | "reference" | "type" | "status" | "backupCode" | "qrPayload" | "createdAt"
>;

export type CreateTripBookingInput = Omit<
  TripBooking,
  "id" | "reference" | "type" | "status" | "backupCode" | "qrPayload" | "createdAt"
>;

export type CreateEventBookingInput = Omit<
  EventBooking,
  "id" | "reference" | "type" | "status" | "backupCode" | "qrPayload" | "createdAt"
>;

export type CreateGuideBookingInput = Omit<
  GuideBooking,
  "id" | "reference" | "type" | "status" | "backupCode" | "qrPayload" | "createdAt"
>;

export type CouponResult =
  | {
      valid: true;
      code: string;
      discountKind: "percent" | "fixed";
      discountValue: number;
    }
  | {
      valid: false;
      reason:
        | "empty"
        | "notFound"
        | "disabled"
        | "scheduled"
        | "expired"
        | "wrongScope"
        | "limitReached"
        | "guestLimitReached";
    };

export type CouponValidationInput = {
  code: string;
  bookingType: CouponBookingType;
  listingId: string;
};

export function calculateCouponDiscountSyp(
  coupon: Extract<CouponResult, { valid: true }> | null,
  listPriceSyp: number,
): number {
  if (!coupon || listPriceSyp <= 0) return 0;
  const discount = coupon.discountKind === "percent"
    ? Math.round((listPriceSyp * coupon.discountValue) / 100)
    : coupon.discountValue;
  return Math.min(listPriceSyp, discount);
}

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
    type: "hotel",
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

function demoRestaurantBooking(): RestaurantBooking {
  const now = new Date();
  const date = toIsoDate(addDays(now, 5));
  const id = "demo-dining";
  const reference = "TRH-DINING";
  const backupCode = "DINING";
  return {
    id,
    reference,
    type: "restaurant",
    restaurantId: "beit-sitti",
    date,
    timeSlot: "20:00",
    partySize: 2,
    zoneId: "terrace",
    specialRequests: "",
    listPriceSyp: 190000,
    discountSyp: 0,
    cashDueSyp: 190000,
    couponCode: null,
    status: "CONFIRMED",
    backupCode,
    qrPayload: JSON.stringify({ bookingId: id, reference, backupCode }),
    createdAt: subDays(now, 3).toISOString(),
  };
}

function demoTripBooking(): TripBooking {
  const now = new Date();
  const date = toIsoDate(addDays(now, 7));
  const id = "demo-trip";
  const reference = "TRH-JOURNY";
  const backupCode = "JOURNY";
  return {
    id,
    reference,
    type: "trip",
    tripId: "damascus-hidden-courtyards",
    date,
    seats: 2,
    pickupPointId: "bab-touma",
    emergencyContact: "+963 944 000 000",
    listPriceSyp: 330000,
    discountSyp: 0,
    cashDueSyp: 330000,
    couponCode: null,
    status: "CONFIRMED",
    backupCode,
    qrPayload: JSON.stringify({ bookingId: id, reference, backupCode }),
    createdAt: subDays(now, 2).toISOString(),
  };
}

function demoEventBooking(): EventBooking {
  const now = new Date();
  const date = toIsoDate(addDays(now, 10));
  const id = "demo-event";
  const reference = "TRH-MUSICA";
  const backupCode = "MUSICA";
  return {
    id,
    reference,
    type: "event",
    eventId: "damascus-oud-evening",
    sessionId: "oud-2",
    ticketTier: "standard",
    quantity: 2,
    date,
    startsAt: "19:30",
    listPriceSyp: 190000,
    discountSyp: 0,
    cashDueSyp: 190000,
    couponCode: null,
    status: "CONFIRMED",
    backupCode,
    qrPayload: JSON.stringify({ bookingId: id, reference, backupCode }),
    createdAt: subDays(now, 1).toISOString(),
  };
}

function demoGuideBooking(): GuideBooking {
  const now = new Date(); const id = "demo-guide"; const reference = "TRH-GUIDED"; const backupCode = "GUIDED";
  return { id, reference, type: "guide", guideId: "layla-al-hakim", date: toIsoDate(addDays(now, 4)), duration: "halfDay", hours: 4, language: "english", focusArea: "history", listPriceSyp: 260000, discountSyp: 0, cashDueSyp: 260000, couponCode: null, status: "CONFIRMED", backupCode, qrPayload: JSON.stringify({ bookingId: id, reference, backupCode }), createdAt: subDays(now, 1).toISOString() };
}

export function listMockTouristBookings(): TouristBooking[] {
  return [
    demoGuideBooking(),
    demoEventBooking(),
    demoTripBooking(),
    demoRestaurantBooking(),
    demoBooking("demo-upcoming", "dar-al-yasmin", "yasmin-double", 12, 2, "CONFIRMED", 480000),
    demoBooking("demo-checked", "citadel-stone-house", "citadel-double", -18, 2, "CHECKED_IN", 420000),
    demoBooking("demo-cancel", "blue-coast-terrace", "coast-double", -42, 1, "CANCELLED", 195000),
  ];
}
