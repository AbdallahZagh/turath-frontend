"use client";

import { format } from "date-fns";
import { parseAsString, useQueryStates } from "nuqs";
import { useMemo } from "react";

import { sanitizeBookingSearch, type BookingSearch } from "@/lib/search/bookingSearch";

const BOOKING_SEARCH_PARSERS = {
  checkIn: parseAsString,
  checkOut: parseAsString,
  guests: parseAsString,
  date: parseAsString,
  time: parseAsString,
  partySize: parseAsString,
  seats: parseAsString,
  qty: parseAsString,
  session: parseAsString,
};

/** Dates and people carried in the URL, already cleaned (see lib/search/bookingSearch.ts). */
export function useBookingSearch(): BookingSearch {
  const [raw] = useQueryStates(BOOKING_SEARCH_PARSERS);
  const today = format(new Date(), "yyyy-MM-dd");
  return useMemo(() => sanitizeBookingSearch(raw, today), [raw, today]);
}
