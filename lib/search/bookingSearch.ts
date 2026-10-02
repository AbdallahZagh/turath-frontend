import { parseAsString } from "nuqs";

import { toLatinDigits } from "@/lib/format/digits";

/**
 * Dates and party size carried from Home, /search and the catalogs to a detail page and its
 * checkout (docs/PAGES.md §0). Hand-typed values are cleaned here: anything malformed, in the
 * past, or out of range is dropped so the checkout falls back to its normal defaults.
 * Arabic-Indic or Persian digits typed into the URL are read as Latin; the address bar is
 * rewritten to Latin by components/layout/LatinUrlDigits.tsx.
 */
export type BookingKind = "hotel" | "restaurant" | "trip" | "event" | "guide";

export const BOOKING_SEARCH_KEYS = [
  "checkIn",
  "checkOut",
  "guests",
  "date",
  "time",
  "partySize",
  "seats",
  "qty",
  "session",
] as const;

type BookingSearchKey = (typeof BOOKING_SEARCH_KEYS)[number];

/**
 * The one URL parser for each carried key, used by the booking search and by every listing's
 * filters. nuqs shares a key's value between all hooks on the page without parsing it again, so
 * two hooks reading the same key must use the same type: these keys are always strings, and
 * readers clean them with readPeople / sanitizeBookingSearch.
 */
export const BOOKING_SEARCH_PARSERS = {
  checkIn: parseAsString,
  checkOut: parseAsString,
  guests: parseAsString,
  date: parseAsString,
  time: parseAsString,
  partySize: parseAsString,
  seats: parseAsString,
  qty: parseAsString,
  session: parseAsString,
} satisfies Record<BookingSearchKey, typeof parseAsString>;

export type BookingSearchInput = Partial<Record<BookingSearchKey, string | null | undefined>>;

export type BookingSearch = {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  date?: string;
  time?: string;
  partySize?: number;
  seats?: number;
  qty?: number;
  session?: string;
};

/** Same ceilings as the checkout forms (lib/validation/booking.ts). */
export const BOOKING_PEOPLE_MAX = { guests: 8, partySize: 12, seats: 12, qty: 6 } as const;

type PeopleKey = keyof typeof BOOKING_PEOPLE_MAX;

const KIND_KEYS: Record<BookingKind, readonly BookingSearchKey[]> = {
  hotel: ["checkIn", "checkOut", "guests"],
  restaurant: ["date", "time", "partySize"],
  trip: ["date", "seats"],
  event: ["date", "qty", "session"],
  guide: ["date"],
};

function isoDate(value: string | null | undefined, today: string): string | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  const exists =
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day;
  return exists && value >= today ? value : undefined;
}

function people(value: string | null | undefined, max: number): number | undefined {
  if (!value || !/^\d{1,3}$/.test(value)) return undefined;
  const parsed = Number(value);
  return parsed >= 1 && parsed <= max ? parsed : undefined;
}

function time(value: string | null | undefined): string | undefined {
  return value && /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : undefined;
}

function slug(value: string | null | undefined): string | undefined {
  return value && /^[a-z0-9-]{1,64}$/i.test(value) ? value : undefined;
}

/** A people count from the URL (any digits), or undefined when missing or out of range. */
export function readPeople(value: string | null | undefined, key: PeopleKey): number | undefined {
  return people(value ? toLatinDigits(value) : value, BOOKING_PEOPLE_MAX[key]);
}

/** A people count for the URL; the default of one person is left out. */
export function peopleParam(value: number | undefined): string | null {
  return value && value > 1 ? String(value) : null;
}

/** `today` is the viewer's local date as yyyy-mm-dd. */
export function sanitizeBookingSearch(raw: BookingSearchInput, today: string): BookingSearch {
  const input: BookingSearchInput = {};
  for (const key of BOOKING_SEARCH_KEYS) {
    const value = raw[key];
    input[key] = value ? toLatinDigits(value) : value;
  }
  const checkIn = isoDate(input.checkIn, today);
  const checkOut = isoDate(input.checkOut, today);
  return {
    checkIn,
    checkOut: checkOut && checkOut > (checkIn ?? today) ? checkOut : undefined,
    guests: people(input.guests, BOOKING_PEOPLE_MAX.guests),
    date: isoDate(input.date, today),
    time: time(input.time),
    partySize: people(input.partySize, BOOKING_PEOPLE_MAX.partySize),
    seats: people(input.seats, BOOKING_PEOPLE_MAX.seats),
    qty: people(input.qty, BOOKING_PEOPLE_MAX.qty),
    session: slug(input.session),
  };
}

/** Query string (no leading `?`) with only the values that apply to this booking type. */
export function bookingSearchQuery(search: BookingSearch, kind: BookingKind): string {
  const params = new URLSearchParams();
  for (const key of KIND_KEYS[kind]) {
    const value = search[key];
    if (value !== undefined) params.set(key, String(value));
  }
  return params.toString();
}

/** Appends the carried values to a detail or checkout link. */
export function withBookingSearch(href: string, search: BookingSearch, kind: BookingKind): string {
  const query = bookingSearchQuery(search, kind);
  if (!query) return href;
  return `${href}${href.includes("?") ? "&" : "?"}${query}`;
}
