import assert from "node:assert/strict";
import test from "node:test";

import {
  bookingSearchQuery,
  sanitizeBookingSearch,
  withBookingSearch,
} from "../lib/search/bookingSearch.ts";

const TODAY = "2026-09-26";

test("valid dates and people carry through unchanged", () => {
  const search = sanitizeBookingSearch(
    {
      checkIn: "2026-10-02",
      checkOut: "2026-10-05",
      guests: "3",
      date: "2026-10-02",
      time: "19:00",
      partySize: "4",
      seats: "2",
      qty: "5",
      session: "damascus-jazz-1",
    },
    TODAY,
  );
  assert.deepEqual(search, {
    checkIn: "2026-10-02",
    checkOut: "2026-10-05",
    guests: 3,
    date: "2026-10-02",
    time: "19:00",
    partySize: 4,
    seats: 2,
    qty: 5,
    session: "damascus-jazz-1",
  });
  assert.equal(
    bookingSearchQuery(search, "hotel"),
    "checkIn=2026-10-02&checkOut=2026-10-05&guests=3",
  );
  assert.equal(
    bookingSearchQuery(search, "restaurant"),
    "date=2026-10-02&time=19%3A00&partySize=4",
  );
  assert.equal(bookingSearchQuery(search, "trip"), "date=2026-10-02&seats=2");
  assert.equal(
    bookingSearchQuery(search, "event"),
    "date=2026-10-02&qty=5&session=damascus-jazz-1",
  );
  assert.equal(bookingSearchQuery(search, "guide"), "date=2026-10-02");
});

test("past, malformed and impossible dates are dropped", () => {
  const search = sanitizeBookingSearch(
    { checkIn: "2026-09-25", checkOut: "2026-02-30", date: "tomorrow" },
    TODAY,
  );
  assert.equal(search.checkIn, undefined);
  assert.equal(search.checkOut, undefined);
  assert.equal(search.date, undefined);
  assert.equal(sanitizeBookingSearch({ date: TODAY }, TODAY).date, TODAY);
});

test("check-out on or before check-in is dropped, check-in kept", () => {
  const same = sanitizeBookingSearch({ checkIn: "2026-10-02", checkOut: "2026-10-02" }, TODAY);
  assert.equal(same.checkIn, "2026-10-02");
  assert.equal(same.checkOut, undefined);
  const before = sanitizeBookingSearch({ checkIn: "2026-10-05", checkOut: "2026-10-03" }, TODAY);
  assert.equal(before.checkOut, undefined);
  const outOnly = sanitizeBookingSearch({ checkOut: TODAY }, TODAY);
  assert.equal(outOnly.checkOut, undefined);
});

test("zero, negative, fractional and over-capacity people fall back", () => {
  for (const value of ["0", "-2", "1.5", "abc", "", "9"]) {
    assert.equal(sanitizeBookingSearch({ guests: value }, TODAY).guests, undefined, value);
  }
  assert.equal(sanitizeBookingSearch({ guests: "8" }, TODAY).guests, 8);
  assert.equal(sanitizeBookingSearch({ partySize: "13" }, TODAY).partySize, undefined);
  assert.equal(sanitizeBookingSearch({ qty: "7" }, TODAY).qty, undefined);
  assert.equal(sanitizeBookingSearch({ seats: "999" }, TODAY).seats, undefined);
  assert.equal(sanitizeBookingSearch({ time: "25:00" }, TODAY).time, undefined);
  assert.equal(sanitizeBookingSearch({ session: "../x" }, TODAY).session, undefined);
});

test("links get only the carried values", () => {
  const search = sanitizeBookingSearch(
    { checkIn: "2026-10-02", guests: "2", partySize: "4" },
    TODAY,
  );
  assert.equal(
    withBookingSearch("/hotels/dar", search, "hotel"),
    "/hotels/dar?checkIn=2026-10-02&guests=2",
  );
  assert.equal(
    withBookingSearch("/bookings/new?type=hotel&id=dar", search, "hotel"),
    "/bookings/new?type=hotel&id=dar&checkIn=2026-10-02&guests=2",
  );
  assert.equal(withBookingSearch("/guides/x", search, "guide"), "/guides/x");
});
