import {
  listMockTouristBookings,
  type CouponResult,
  type CouponValidationInput,
  type CreateHotelBookingInput,
  type CreateRestaurantBookingInput,
  type CreateTripBookingInput,
  type CreateEventBookingInput,
  type CreateGuideBookingInput,
  type HotelBooking,
  type RestaurantBooking,
  type TripBooking,
  type EventBooking,
  type GuideBooking,
  type TouristBooking,
  type TouristBookingReview,
} from "@/lib/mock/bookings";
import {
  couponStatus,
  listAdminCoupons,
  normalizeCouponCode,
  type AdminCoupon,
} from "@/lib/mock/adminCoupons";
import { getCouponTarget, type CouponTarget } from "@/lib/mock/couponTargets";

const STORAGE_KEY = "turath-tourist-bookings";
const REVIEW_STORAGE_KEY = "turath-tourist-booking-reviews";
const memoryBookings = new Map<string, TouristBooking>();

type LegacyHotelBooking = Omit<HotelBooking, "type">;

function makeToken(length: number): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(length);
  if (typeof crypto !== "undefined") crypto.getRandomValues(bytes);
  else bytes.forEach((_, index) => { bytes[index] = Math.floor(Math.random() * 256); });
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

function normalizeBooking(booking: TouristBooking | LegacyHotelBooking): TouristBooking {
  return "type" in booking ? booking : { ...booking, type: "hotel" };
}

function readBookings(): TouristBooking[] {
  if (typeof window === "undefined") return Array.from(memoryBookings.values());
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return listMockTouristBookings();
    const stored = (JSON.parse(raw) as Array<TouristBooking | LegacyHotelBooking>).map(normalizeBooking);
    const storedIds = new Set(stored.map((booking) => booking.id));
    return [
      ...stored,
      ...listMockTouristBookings().filter((booking) => !storedIds.has(booking.id)),
    ];
  } catch {
    const memory = Array.from(memoryBookings.values());
    return memory.length > 0 ? memory : listMockTouristBookings();
  }
}

function saveBooking(booking: TouristBooking): void {
  memoryBookings.set(booking.id, booking);
  if (typeof window === "undefined") return;
  try {
    const next = [booking, ...readBookings().filter((item) => item.id !== booking.id)];
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // The in-memory copy keeps this frontend demo usable when storage is unavailable.
  }
}

function couponMatchesTarget(coupon: AdminCoupon, target: CouponTarget): boolean {
  if (coupon.scope === "platform") return true;
  if (coupon.scope === "pillar") return coupon.scopeId === target.pillar;
  if (coupon.scope === "provider") return coupon.scopeId === target.providerId;
  return coupon.scopeId === target.listingId;
}

export async function validateBookingCoupon(
  input: CouponValidationInput,
): Promise<CouponResult> {
  const code = normalizeCouponCode(input.code);
  if (!code) return { valid: false, reason: "empty" };

  const coupon = listAdminCoupons().find((row) => row.code === code);
  if (!coupon) return { valid: false, reason: "notFound" };

  const status = couponStatus(coupon);
  if (status === "disabled") return { valid: false, reason: "disabled" };
  if (status === "scheduled") return { valid: false, reason: "scheduled" };
  if (status === "ended") return { valid: false, reason: "expired" };

  const target = getCouponTarget(input.bookingType, input.listingId);
  if (!target || !couponMatchesTarget(coupon, target)) {
    return { valid: false, reason: "wrongScope" };
  }

  const redemptions = readBookings().filter(
    (booking) => booking.couponCode === code && booking.status !== "CANCELLED",
  ).length;
  if (coupon.maxRedemptions !== null && redemptions >= coupon.maxRedemptions) {
    return { valid: false, reason: "limitReached" };
  }
  if (coupon.perGuestCap !== null && redemptions >= coupon.perGuestCap) {
    return { valid: false, reason: "guestLimitReached" };
  }

  return {
    valid: true,
    code,
    discountKind: coupon.discountKind,
    discountValue: coupon.discountValue,
  };
}

export async function createHotelBooking(
  input: CreateHotelBookingInput,
): Promise<HotelBooking> {
  const id = `hotel-${Date.now().toString(36)}-${makeToken(4).toLowerCase()}`;
  const reference = `TRH-${makeToken(6)}`;
  const backupCode = makeToken(6);
  const booking: HotelBooking = {
    ...input,
    id,
    reference,
    type: "hotel",
    status: "CONFIRMED",
    backupCode,
    qrPayload: JSON.stringify({ bookingId: id, reference, backupCode }),
    createdAt: new Date().toISOString(),
  };
  saveBooking(booking);
  return booking;
}

export async function createRestaurantBooking(input: CreateRestaurantBookingInput): Promise<RestaurantBooking> {
  const id = `restaurant-${Date.now().toString(36)}-${makeToken(4).toLowerCase()}`;
  const reference = `TRH-${makeToken(6)}`;
  const backupCode = makeToken(6);
  const booking: RestaurantBooking = {
    ...input,
    id,
    reference,
    type: "restaurant",
    status: "CONFIRMED",
    backupCode,
    qrPayload: JSON.stringify({ bookingId: id, reference, backupCode }),
    createdAt: new Date().toISOString(),
  };
  saveBooking(booking);
  return booking;
}

export async function createTripBooking(input: CreateTripBookingInput): Promise<TripBooking> {
  const id = `trip-${Date.now().toString(36)}-${makeToken(4).toLowerCase()}`;
  const reference = `TRH-${makeToken(6)}`;
  const backupCode = makeToken(6);
  const booking: TripBooking = {
    ...input,
    id,
    reference,
    type: "trip",
    status: "CONFIRMED",
    backupCode,
    qrPayload: JSON.stringify({ bookingId: id, reference, backupCode }),
    createdAt: new Date().toISOString(),
  };
  saveBooking(booking);
  return booking;
}

export async function createEventBooking(input: CreateEventBookingInput): Promise<EventBooking> {
  const id = `event-${Date.now().toString(36)}-${makeToken(4).toLowerCase()}`;
  const reference = `TRH-${makeToken(6)}`;
  const backupCode = makeToken(6);
  const booking: EventBooking = { ...input, id, reference, type: "event", status: "CONFIRMED", backupCode, qrPayload: JSON.stringify({ bookingId: id, reference, backupCode }), createdAt: new Date().toISOString() };
  saveBooking(booking);
  return booking;
}

export async function createGuideBooking(input: CreateGuideBookingInput): Promise<GuideBooking> {
  const id = `guide-${Date.now().toString(36)}-${makeToken(4).toLowerCase()}`;
  const reference = `TRH-${makeToken(6)}`; const backupCode = makeToken(6);
  const booking: GuideBooking = { ...input, id, reference, type: "guide", status: "CONFIRMED", backupCode, qrPayload: JSON.stringify({ bookingId: id, reference, backupCode }), createdAt: new Date().toISOString() };
  saveBooking(booking); return booking;
}

export async function getTouristBooking(id: string): Promise<TouristBooking | null> {
  return readBookings().find((booking) => booking.id === id) ?? memoryBookings.get(id) ?? null;
}

export async function listTouristBookings(): Promise<TouristBooking[]> {
  return readBookings();
}

export type TouristBookingCheckInResult =
  | { kind: "notFound" }
  | { kind: "alreadyUsed"; booking: TouristBooking }
  | { kind: "checkedIn"; booking: TouristBooking };

export async function checkInTouristBookingByBackupCode(
  rawCode: string,
  staffName: string,
): Promise<TouristBookingCheckInResult> {
  const code = rawCode.trim().toUpperCase();
  const booking = readBookings().find(
    (item) => item.backupCode.toUpperCase() === code,
  );
  if (!booking) return { kind: "notFound" };
  if (booking.status === "CHECKED_IN") return { kind: "alreadyUsed", booking };
  if (booking.status !== "CONFIRMED" && booking.status !== "PENDING") {
    return { kind: "notFound" };
  }
  const checkedIn: TouristBooking = {
    ...booking,
    status: "CHECKED_IN",
    checkedInAt: new Date().toISOString(),
    checkedInBy: staffName,
  };
  saveBooking(checkedIn);
  return { kind: "checkedIn", booking: checkedIn };
}

export async function submitTouristBookingReview(
  review: Omit<TouristBookingReview, "submittedAt">,
): Promise<TouristBookingReview> {
  const booking = await getTouristBooking(review.bookingId);
  if (!booking || booking.status !== "CHECKED_IN") {
    throw new Error("reviewUnavailable");
  }
  const saved = { ...review, submittedAt: new Date().toISOString() };
  if (typeof window !== "undefined") {
    const current = window.sessionStorage.getItem(REVIEW_STORAGE_KEY);
    const reviews = current ? (JSON.parse(current) as TouristBookingReview[]) : [];
    window.sessionStorage.setItem(
      REVIEW_STORAGE_KEY,
      JSON.stringify([saved, ...reviews.filter((item) => item.bookingId !== review.bookingId)]),
    );
  }
  return saved;
}
