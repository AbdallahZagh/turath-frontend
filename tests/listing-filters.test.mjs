import assert from "node:assert/strict";
import test from "node:test";

import { toLatinDigits } from "../lib/format/digits.ts";
import { sanitizeBookingSearch } from "../lib/search/bookingSearch.ts";
import {
  EVENT_FILTERS_URL,
  HOTEL_FILTERS_URL,
  RESTAURANT_FILTERS_URL,
  TRIP_FILTERS_URL,
} from "../lib/search/listingFilters.ts";

const TODAY = "2026-09-26";

/** What nuqs does on a page: parse every key of the query with the listing's parsers. */
function parseQuery(url, query) {
  const params = new URLSearchParams(query);
  const state = {};
  for (const [key, parser] of Object.entries(url.parsers)) {
    const raw = params.get(key);
    state[key] = raw === null ? null : parser.parse(raw);
  }
  return state;
}

/**
 * nuqs hands the value a filter hook wrote straight to every other hook reading that key, without
 * parsing it again, so the booking search must accept whatever the filters write.
 */
function changeFilterThenReadBookingSearch(url, query, change) {
  const filters = url.read(parseQuery(url, query));
  const written = url.write(change(filters));
  return { filters, written, search: sanitizeBookingSearch(written, TODAY) };
}

test("hotels: guests=3, then removing the AC chip keeps guests and nothing throws", () => {
  const { filters, written, search } = changeFilterThenReadBookingSearch(
    HOTEL_FILTERS_URL,
    "guests=3&amenities=ac",
    (current) => ({ ...current, amenities: current.amenities?.filter((item) => item !== "ac") }),
  );
  assert.equal(filters.guests, 3);
  assert.deepEqual(filters.amenities, ["ac"]);
  assert.equal(written.guests, "3");
  assert.equal(written.amenities, null);
  assert.equal(search.guests, 3);
});

test("hotels: guests=3, then changing the governorate keeps guests and nothing throws", () => {
  const { written, search } = changeFilterThenReadBookingSearch(
    HOTEL_FILTERS_URL,
    "guests=3",
    (current) => ({ ...current, governorate: "damascus" }),
  );
  assert.equal(written.guests, "3");
  assert.equal(written.governorate, "damascus");
  assert.equal(search.guests, 3);
});

test("trips and events: seats=3 / qty=3, then another filter, nothing throws", () => {
  const trip = changeFilterThenReadBookingSearch(TRIP_FILTERS_URL, "seats=3", (current) => ({
    ...current,
    duration: "fullDay",
  }));
  assert.equal(trip.written.seats, "3");
  assert.equal(trip.search.seats, 3);

  const event = changeFilterThenReadBookingSearch(
    EVENT_FILTERS_URL,
    "qty=3&tier=vip",
    (current) => ({
      ...current,
      ticketTier: undefined,
    }),
  );
  assert.equal(event.written.qty, "3");
  assert.equal(event.search.qty, 3);
});

test("restaurants: partySize=3, then removing the AC chip keeps the party and nothing throws", () => {
  const { written, search } = changeFilterThenReadBookingSearch(
    RESTAURANT_FILTERS_URL,
    "partySize=3&amenities=ac",
    (current) => ({ ...current, amenities: [] }),
  );
  assert.equal(written.partySize, "3");
  assert.equal(written.amenities, null);
  assert.equal(search.partySize, 3);
  assert.equal(RESTAURANT_FILTERS_URL.read(parseQuery(RESTAURANT_FILTERS_URL, "")).partySize, 2);
  assert.equal(RESTAURANT_FILTERS_URL.write({ partySize: 2 }).partySize, null);
  assert.equal(RESTAURANT_FILTERS_URL.write({ partySize: 1 }).partySize, "1");
});

test("people counts in Arabic digits read the same and fall back when out of range", () => {
  assert.equal(HOTEL_FILTERS_URL.read(parseQuery(HOTEL_FILTERS_URL, "guests=٣")).guests, 3);
  assert.equal(HOTEL_FILTERS_URL.read(parseQuery(HOTEL_FILTERS_URL, "guests=9")).guests, 1);
  assert.equal(HOTEL_FILTERS_URL.write({ guests: 1 }).guests, null);
});

test("toLatinDigits never throws on a value that isn't a string", () => {
  assert.equal(toLatinDigits(3), "3");
  assert.equal(toLatinDigits(null), "");
  assert.equal(toLatinDigits(undefined), "");
  assert.doesNotThrow(() => sanitizeBookingSearch({ guests: 3, seats: 2, qty: 4 }, TODAY));
  assert.equal(sanitizeBookingSearch({ guests: 3 }, TODAY).guests, 3);
});
