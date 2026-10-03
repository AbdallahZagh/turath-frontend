import {
  parseAsArrayOf,
  parseAsStringLiteral,
  type Nullable,
  type UseQueryStatesKeysMap,
  type Values,
} from "nuqs";

import type { EventFilters, EventPriceRange, EventTierId } from "@/lib/mock/events";
import type {
  GuideDurationId,
  GuideFilters,
  GuideLanguageId,
  GuidePriceRange,
  GuideSpecialtyId,
} from "@/lib/mock/guides";
import type {
  HotelAmenityId,
  HotelFilters,
  HotelPriceRange,
  HotelRoomTypeId,
} from "@/lib/mock/hotels";
import { GOVERNORATES, type GovernorateSlug } from "@/lib/mock/landing";
import type {
  RestaurantAmenityId,
  RestaurantFilters,
  RestaurantPriceRange,
  RestaurantZoneId,
} from "@/lib/mock/restaurants";
import type { TripDurationId, TripFilters, TripPriceRange } from "@/lib/mock/trips";
import {
  BOOKING_PEOPLE_MAX,
  BOOKING_SEARCH_PARSERS,
  peopleParam,
  readPeople,
} from "@/lib/search/bookingSearch";

/**
 * Listing filters live in the URL query (docs/PAGES.md §5 Category indexes), so a filtered
 * list is shareable and survives a reload. People counts use the booking-search names
 * (`guests`, `seats`, `qty`, §0) so the cards carry them on to the detail page, and they share
 * the booking-search parsers (strings, read with readPeople) so both hooks see the same type.
 */
const GOVERNORATE_SLUGS: readonly GovernorateSlug[] = GOVERNORATES.map((item) => item.slug);

export const HOTEL_FILTER_AMENITIES: readonly HotelAmenityId[] = ["generator", "wifi", "ac"];
export const HOTEL_ROOM_TYPES: readonly HotelRoomTypeId[] = ["single", "double", "suite"];
export const HOTEL_PRICE_RANGES: readonly HotelPriceRange[] = ["under150", "150to300", "over300"];
export const HOTEL_MAX_GUESTS = BOOKING_PEOPLE_MAX.guests;

export const RESTAURANT_ZONES: readonly RestaurantZoneId[] = [
  "indoor",
  "terrace",
  "vip",
  "smoking",
];
export const RESTAURANT_PRICE_RANGES: readonly RestaurantPriceRange[] = [
  "under75",
  "75to150",
  "over150",
];
export const RESTAURANT_FILTER_AMENITIES: readonly RestaurantAmenityId[] = [
  "generator",
  "wifi",
  "ac",
  "accessible",
];
export const RESTAURANT_MAX_PARTY = BOOKING_PEOPLE_MAX.partySize;
/** A table search starts at two guests, as the dining checkout does. */
export const RESTAURANT_DEFAULT_PARTY = 2;

export const TRIP_DURATIONS: readonly TripDurationId[] = ["halfDay", "fullDay", "multiDay"];
export const TRIP_PRICE_RANGES: readonly TripPriceRange[] = ["under200", "200to400", "over400"];
export const TRIP_MAX_SEATS = BOOKING_PEOPLE_MAX.seats;

export const EVENT_TIERS: readonly EventTierId[] = ["standard", "vip"];
export const EVENT_PRICE_RANGES: readonly EventPriceRange[] = ["under100", "100to250", "over250"];
export const EVENT_MAX_TICKETS = BOOKING_PEOPLE_MAX.qty;

export const GUIDE_LANGUAGES: readonly GuideLanguageId[] = [
  "arabic",
  "english",
  "french",
  "german",
];
export const GUIDE_SPECIALTIES: readonly GuideSpecialtyId[] = [
  "history",
  "architecture",
  "food",
  "photography",
  "hiking",
];
export const GUIDE_DURATIONS: readonly GuideDurationId[] = ["hourly", "halfDay", "fullDay"];
export const GUIDE_PRICE_RANGES: readonly GuidePriceRange[] = ["under100", "100to250", "over250"];

const HOTEL_FILTER_PARSERS = {
  governorate: parseAsStringLiteral(GOVERNORATE_SLUGS),
  priceRange: parseAsStringLiteral(HOTEL_PRICE_RANGES),
  roomType: parseAsStringLiteral(HOTEL_ROOM_TYPES),
  guests: BOOKING_SEARCH_PARSERS.guests,
  amenities: parseAsArrayOf(parseAsStringLiteral(HOTEL_FILTER_AMENITIES)),
};

const RESTAURANT_FILTER_PARSERS = {
  governorate: parseAsStringLiteral(GOVERNORATE_SLUGS),
  zone: parseAsStringLiteral(RESTAURANT_ZONES),
  priceRange: parseAsStringLiteral(RESTAURANT_PRICE_RANGES),
  partySize: BOOKING_SEARCH_PARSERS.partySize,
  amenities: parseAsArrayOf(parseAsStringLiteral(RESTAURANT_FILTER_AMENITIES)),
};

const TRIP_FILTER_PARSERS = {
  governorate: parseAsStringLiteral(GOVERNORATE_SLUGS),
  date: BOOKING_SEARCH_PARSERS.date,
  duration: parseAsStringLiteral(TRIP_DURATIONS),
  priceRange: parseAsStringLiteral(TRIP_PRICE_RANGES),
  seats: BOOKING_SEARCH_PARSERS.seats,
};

const EVENT_FILTER_PARSERS = {
  governorate: parseAsStringLiteral(GOVERNORATE_SLUGS),
  date: BOOKING_SEARCH_PARSERS.date,
  tier: parseAsStringLiteral(EVENT_TIERS),
  priceRange: parseAsStringLiteral(EVENT_PRICE_RANGES),
  qty: BOOKING_SEARCH_PARSERS.qty,
};

const GUIDE_FILTER_PARSERS = {
  governorate: parseAsStringLiteral(GOVERNORATE_SLUGS),
  language: parseAsStringLiteral(GUIDE_LANGUAGES),
  specialty: parseAsStringLiteral(GUIDE_SPECIALTIES),
  duration: parseAsStringLiteral(GUIDE_DURATIONS),
  priceRange: parseAsStringLiteral(GUIDE_PRICE_RANGES),
};

/**
 * One listing's URL step: the parsers, and the two pure mappings between the parsed query and
 * the filter object. Writing goes through the same types the parsers read, so every hook that
 * shares a key sees the same value.
 */
export type ListingFiltersUrl<Parsers extends UseQueryStatesKeysMap, Filters> = {
  parsers: Parsers;
  read: (state: Values<Parsers>) => Filters;
  write: (filters: Filters) => Nullable<Values<Parsers>>;
};

function listingFiltersUrl<Parsers extends UseQueryStatesKeysMap, Filters>(
  url: ListingFiltersUrl<Parsers, Filters>,
): ListingFiltersUrl<Parsers, Filters> {
  return url;
}

export const HOTEL_FILTERS_URL = listingFiltersUrl({
  parsers: HOTEL_FILTER_PARSERS,
  read: (state): HotelFilters => ({
    governorate: state.governorate ?? undefined,
    priceRange: state.priceRange ?? undefined,
    roomType: state.roomType ?? undefined,
    guests: readPeople(state.guests, "guests") ?? 1,
    amenities: state.amenities ?? [],
  }),
  write: (filters: HotelFilters) => ({
    governorate: filters.governorate ?? null,
    priceRange: filters.priceRange ?? null,
    roomType: filters.roomType ?? null,
    guests: peopleParam(filters.guests),
    amenities: filters.amenities?.length ? [...filters.amenities] : null,
  }),
});

export const RESTAURANT_FILTERS_URL = listingFiltersUrl({
  parsers: RESTAURANT_FILTER_PARSERS,
  read: (state): RestaurantFilters => ({
    governorate: state.governorate ?? undefined,
    zone: state.zone ?? undefined,
    priceRange: state.priceRange ?? undefined,
    partySize: readPeople(state.partySize, "partySize") ?? RESTAURANT_DEFAULT_PARTY,
    amenities: state.amenities ?? [],
  }),
  write: (filters: RestaurantFilters) => ({
    governorate: filters.governorate ?? null,
    zone: filters.zone ?? null,
    priceRange: filters.priceRange ?? null,
    partySize: peopleParam(filters.partySize, RESTAURANT_DEFAULT_PARTY),
    amenities: filters.amenities?.length ? [...filters.amenities] : null,
  }),
});

export const TRIP_FILTERS_URL = listingFiltersUrl({
  parsers: TRIP_FILTER_PARSERS,
  read: (state): TripFilters => ({
    governorate: state.governorate ?? undefined,
    date: state.date ?? undefined,
    duration: state.duration ?? undefined,
    priceRange: state.priceRange ?? undefined,
    minSeats: readPeople(state.seats, "seats") ?? 1,
  }),
  write: (filters: TripFilters) => ({
    governorate: filters.governorate ?? null,
    date: filters.date ?? null,
    duration: filters.duration ?? null,
    priceRange: filters.priceRange ?? null,
    seats: peopleParam(filters.minSeats),
  }),
});

export const EVENT_FILTERS_URL = listingFiltersUrl({
  parsers: EVENT_FILTER_PARSERS,
  read: (state): EventFilters => ({
    governorate: state.governorate ?? undefined,
    date: state.date ?? undefined,
    ticketTier: state.tier ?? undefined,
    priceRange: state.priceRange ?? undefined,
    minTickets: readPeople(state.qty, "qty") ?? 1,
  }),
  write: (filters: EventFilters) => ({
    governorate: filters.governorate ?? null,
    date: filters.date ?? null,
    tier: filters.ticketTier ?? null,
    priceRange: filters.priceRange ?? null,
    qty: peopleParam(filters.minTickets),
  }),
});

export const GUIDE_FILTERS_URL = listingFiltersUrl({
  parsers: GUIDE_FILTER_PARSERS,
  read: (state): GuideFilters => ({
    governorate: state.governorate ?? undefined,
    language: state.language ?? undefined,
    specialty: state.specialty ?? undefined,
    duration: state.duration ?? undefined,
    priceRange: state.priceRange ?? undefined,
  }),
  write: (filters: GuideFilters) => ({
    governorate: filters.governorate ?? null,
    language: filters.language ?? null,
    specialty: filters.specialty ?? null,
    duration: filters.duration ?? null,
    priceRange: filters.priceRange ?? null,
  }),
});
