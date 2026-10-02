"use client";

import { useQueryStates } from "nuqs";
import { useMemo } from "react";

import { toIsoDate } from "@/lib/format/datetime";
import {
  BOOKING_SEARCH_PARSERS,
  sanitizeBookingSearch,
  type BookingSearch,
} from "@/lib/search/bookingSearch";

/** Dates and people carried in the URL, already cleaned (see lib/search/bookingSearch.ts). */
export function useBookingSearch(): BookingSearch {
  const [raw] = useQueryStates(BOOKING_SEARCH_PARSERS);
  const today = toIsoDate(new Date());
  return useMemo(() => sanitizeBookingSearch(raw, today), [raw, today]);
}
