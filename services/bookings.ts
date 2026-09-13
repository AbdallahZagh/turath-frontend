import {
  listMockTouristBookings,
  validateMockHotelCoupon,
  type CouponResult,
  type CreateHotelBookingInput,
  type HotelBooking,
  type TouristBookingReview,
} from "@/lib/mock/bookings";

const STORAGE_KEY = "turath-tourist-bookings";
const REVIEW_STORAGE_KEY = "turath-tourist-booking-reviews";
const memoryBookings = new Map<string, HotelBooking>();

function makeToken(length: number): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(length);
  if (typeof crypto !== "undefined") crypto.getRandomValues(bytes);
  else bytes.forEach((_, index) => { bytes[index] = Math.floor(Math.random() * 256); });
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

function readBookings(): HotelBooking[] {
  if (typeof window === "undefined") return Array.from(memoryBookings.values());
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return listMockTouristBookings();
    const stored = JSON.parse(raw) as HotelBooking[];
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

function saveBooking(booking: HotelBooking): void {
  memoryBookings.set(booking.id, booking);
  if (typeof window === "undefined") return;
  try {
    const next = [booking, ...readBookings().filter((item) => item.id !== booking.id)];
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // The in-memory copy keeps this frontend demo usable when storage is unavailable.
  }
}

export async function validateHotelCoupon(code: string): Promise<CouponResult> {
  return validateMockHotelCoupon(code);
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
    status: "CONFIRMED",
    backupCode,
    qrPayload: JSON.stringify({ bookingId: id, reference, backupCode }),
    createdAt: new Date().toISOString(),
  };
  saveBooking(booking);
  return booking;
}

export async function getTouristBooking(id: string): Promise<HotelBooking | null> {
  return readBookings().find((booking) => booking.id === id) ?? memoryBookings.get(id) ?? null;
}

export async function listTouristBookings(): Promise<HotelBooking[]> {
  return readBookings();
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
