"use client";

import { useSearchParams } from "next/navigation";
import { parseAsString, useQueryStates, type UseQueryStatesKeysMap } from "nuqs";
import { useCallback, useEffect, useMemo } from "react";

import type { EventFilters } from "@/lib/mock/events";
import type { GuideFilters } from "@/lib/mock/guides";
import type { HotelFilters } from "@/lib/mock/hotels";
import type { RestaurantFilters } from "@/lib/mock/restaurants";
import type { TripFilters } from "@/lib/mock/trips";
import {
  EVENT_FILTERS_URL,
  GUIDE_FILTERS_URL,
  HOTEL_FILTERS_URL,
  RESTAURANT_FILTERS_URL,
  TRIP_FILTERS_URL,
  clearedListingParams,
  isClearedFilterQuery,
  unusedListingParams,
  type ListingFiltersUrl,
} from "@/lib/search/listingFilters";

/** Filter state for one listing, read from and written to the URL query. */
export type ListingFiltersState<Filters> = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  reset: () => void;
};

const URL_OPTIONS = { history: "replace" } as const;

/**
 * One listing's filters in the URL. Opening the page drops query keys the listing does not read;
 * clearing the filters (Reset, Clear filters, or removing the last chip) drops every key except
 * the carried ones the listing still shows (lib/search/listingFilters.ts), the same on every listing.
 * Keys outside the filters are removed through nuqs too (as strings, like the booking search), so
 * one URL update clears everything and every hook on the page sees it.
 */
function useListingFilters<Parsers extends UseQueryStatesKeysMap, Filters>(
  url: ListingFiltersUrl<Parsers, Filters>,
): ListingFiltersState<Filters> {
  const [state, setState] = useQueryStates(url.parsers, URL_OPTIONS);
  const query = useSearchParams().toString();
  const otherKeys = useMemo(
    () => [...new Set(new URLSearchParams(query).keys())].filter((key) => !(key in url.parsers)),
    [query, url],
  );
  const otherParsers = useMemo(
    () => Object.fromEntries(otherKeys.map((key) => [key, parseAsString])),
    [otherKeys],
  );
  const [, setOther] = useQueryStates(otherParsers, URL_OPTIONS);

  const removeOther = useCallback(
    (keys: string[]): void => {
      const remove = keys.filter((key) => !(key in url.parsers));
      if (remove.length > 0) void setOther(Object.fromEntries(remove.map((key) => [key, null])));
    },
    [setOther, url],
  );

  useEffect(() => {
    removeOther(unusedListingParams(url, new URLSearchParams(query)));
  }, [query, removeOther, url]);

  const reset = (): void => {
    void setState(null);
    removeOther(clearedListingParams(url, new URLSearchParams(query)));
  };

  return {
    filters: url.read(state),
    setFilters: (filters) => {
      const written = url.write(filters);
      if (isClearedFilterQuery(written)) {
        reset();
        return;
      }
      void setState(written);
    },
    reset,
  };
}

export function useHotelFilters(): ListingFiltersState<HotelFilters> {
  return useListingFilters(HOTEL_FILTERS_URL);
}

export function useRestaurantFilters(): ListingFiltersState<RestaurantFilters> {
  return useListingFilters(RESTAURANT_FILTERS_URL);
}

export function useTripFilters(): ListingFiltersState<TripFilters> {
  return useListingFilters(TRIP_FILTERS_URL);
}

export function useEventFilters(): ListingFiltersState<EventFilters> {
  return useListingFilters(EVENT_FILTERS_URL);
}

export function useGuideFilters(): ListingFiltersState<GuideFilters> {
  return useListingFilters(GUIDE_FILTERS_URL);
}
