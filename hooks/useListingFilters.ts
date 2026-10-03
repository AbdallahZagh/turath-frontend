"use client";

import { useQueryStates, type UseQueryStatesKeysMap } from "nuqs";

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
  type ListingFiltersUrl,
} from "@/lib/search/listingFilters";

/** Filter state for one listing, read from and written to the URL query. */
export type ListingFiltersState<Filters> = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  reset: () => void;
};

const URL_OPTIONS = { history: "replace" } as const;

function useListingFilters<Parsers extends UseQueryStatesKeysMap, Filters>(
  url: ListingFiltersUrl<Parsers, Filters>,
): ListingFiltersState<Filters> {
  const [state, setState] = useQueryStates(url.parsers, URL_OPTIONS);
  return {
    filters: url.read(state),
    setFilters: (filters) => void setState(url.write(filters)),
    reset: () => void setState(null),
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
