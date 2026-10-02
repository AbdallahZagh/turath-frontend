import {
  parseAsArrayOf,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs";

import type { EventPriceRange, EventTierId } from "@/lib/mock/events";
import type {
  GuideDurationId,
  GuideLanguageId,
  GuidePriceRange,
  GuideSpecialtyId,
} from "@/lib/mock/guides";
import type { HotelAmenityId, HotelPriceRange, HotelRoomTypeId } from "@/lib/mock/hotels";
import { GOVERNORATES, type GovernorateSlug } from "@/lib/mock/landing";
import type { TripDurationId, TripPriceRange } from "@/lib/mock/trips";

/**
 * Listing filters live in the URL query (docs/PAGES.md §5 Category indexes), so a filtered
 * list is shareable and survives a reload. People counts use the booking-search names
 * (`guests`, `seats`, `qty`, §0) so the cards carry them on to the detail page.
 */
const GOVERNORATE_SLUGS: readonly GovernorateSlug[] = GOVERNORATES.map((item) => item.slug);

function peopleRange(max: number): number[] {
  return Array.from({ length: max }, (_, index) => index + 1);
}

export const HOTEL_FILTER_AMENITIES: readonly HotelAmenityId[] = ["generator", "wifi", "ac"];
export const HOTEL_ROOM_TYPES: readonly HotelRoomTypeId[] = ["single", "double", "suite"];
export const HOTEL_PRICE_RANGES: readonly HotelPriceRange[] = ["under150", "150to300", "over300"];
export const HOTEL_MAX_GUESTS = 8;

export const TRIP_DURATIONS: readonly TripDurationId[] = ["halfDay", "fullDay", "multiDay"];
export const TRIP_PRICE_RANGES: readonly TripPriceRange[] = ["under200", "200to400", "over400"];
export const TRIP_MAX_SEATS = 12;

export const EVENT_TIERS: readonly EventTierId[] = ["standard", "vip"];
export const EVENT_PRICE_RANGES: readonly EventPriceRange[] = ["under100", "100to250", "over250"];
export const EVENT_MAX_TICKETS = 6;

export const GUIDE_LANGUAGES: readonly GuideLanguageId[] = ["arabic", "english", "french", "german"];
export const GUIDE_SPECIALTIES: readonly GuideSpecialtyId[] = [
  "history",
  "architecture",
  "food",
  "photography",
  "hiking",
];
export const GUIDE_DURATIONS: readonly GuideDurationId[] = ["hourly", "halfDay", "fullDay"];
export const GUIDE_PRICE_RANGES: readonly GuidePriceRange[] = ["under100", "100to250", "over250"];

export const HOTEL_FILTER_PARSERS = {
  governorate: parseAsStringLiteral(GOVERNORATE_SLUGS),
  priceRange: parseAsStringLiteral(HOTEL_PRICE_RANGES),
  roomType: parseAsStringLiteral(HOTEL_ROOM_TYPES),
  guests: parseAsNumberLiteral(peopleRange(HOTEL_MAX_GUESTS)),
  amenities: parseAsArrayOf(parseAsStringLiteral(HOTEL_FILTER_AMENITIES)),
};

export const TRIP_FILTER_PARSERS = {
  governorate: parseAsStringLiteral(GOVERNORATE_SLUGS),
  date: parseAsString,
  duration: parseAsStringLiteral(TRIP_DURATIONS),
  priceRange: parseAsStringLiteral(TRIP_PRICE_RANGES),
  seats: parseAsNumberLiteral(peopleRange(TRIP_MAX_SEATS)),
};

export const EVENT_FILTER_PARSERS = {
  governorate: parseAsStringLiteral(GOVERNORATE_SLUGS),
  date: parseAsString,
  tier: parseAsStringLiteral(EVENT_TIERS),
  priceRange: parseAsStringLiteral(EVENT_PRICE_RANGES),
  qty: parseAsNumberLiteral(peopleRange(EVENT_MAX_TICKETS)),
};

export const GUIDE_FILTER_PARSERS = {
  governorate: parseAsStringLiteral(GOVERNORATE_SLUGS),
  language: parseAsStringLiteral(GUIDE_LANGUAGES),
  specialty: parseAsStringLiteral(GUIDE_SPECIALTIES),
  duration: parseAsStringLiteral(GUIDE_DURATIONS),
  priceRange: parseAsStringLiteral(GUIDE_PRICE_RANGES),
};
