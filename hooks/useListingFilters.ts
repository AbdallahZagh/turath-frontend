"use client";

import { useQueryStates } from "nuqs";

import type { EventFilters } from "@/lib/mock/events";
import type { GuideFilters } from "@/lib/mock/guides";
import type { HotelFilters } from "@/lib/mock/hotels";
import type { TripFilters } from "@/lib/mock/trips";
import {
  EVENT_FILTER_PARSERS,
  GUIDE_FILTER_PARSERS,
  HOTEL_FILTER_PARSERS,
  TRIP_FILTER_PARSERS,
} from "@/lib/search/listingFilters";

/** Filter state for one listing, read from and written to the URL query. */
export type ListingFiltersState<Filters> = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  reset: () => void;
};

const URL_OPTIONS = { history: "replace" } as const;

/** A count at its default (one person) is left out of the URL. */
function countParam(value: number | undefined): number | null {
  return value && value > 1 ? value : null;
}

export function useHotelFilters(): ListingFiltersState<HotelFilters> {
  const [state, setState] = useQueryStates(HOTEL_FILTER_PARSERS, URL_OPTIONS);
  return {
    filters: {
      governorate: state.governorate ?? undefined,
      priceRange: state.priceRange ?? undefined,
      roomType: state.roomType ?? undefined,
      guests: state.guests ?? 1,
      amenities: state.amenities ?? [],
    },
    setFilters: (filters) =>
      void setState({
        governorate: filters.governorate ?? null,
        priceRange: filters.priceRange ?? null,
        roomType: filters.roomType ?? null,
        guests: countParam(filters.guests),
        amenities: filters.amenities?.length ? filters.amenities : null,
      }),
    reset: () => void setState(null),
  };
}

export function useTripFilters(): ListingFiltersState<TripFilters> {
  const [state, setState] = useQueryStates(TRIP_FILTER_PARSERS, URL_OPTIONS);
  return {
    filters: {
      governorate: state.governorate ?? undefined,
      date: state.date ?? undefined,
      duration: state.duration ?? undefined,
      priceRange: state.priceRange ?? undefined,
      minSeats: state.seats ?? 1,
    },
    setFilters: (filters) =>
      void setState({
        governorate: filters.governorate ?? null,
        date: filters.date ?? null,
        duration: filters.duration ?? null,
        priceRange: filters.priceRange ?? null,
        seats: countParam(filters.minSeats),
      }),
    reset: () => void setState(null),
  };
}

export function useEventFilters(): ListingFiltersState<EventFilters> {
  const [state, setState] = useQueryStates(EVENT_FILTER_PARSERS, URL_OPTIONS);
  return {
    filters: {
      governorate: state.governorate ?? undefined,
      date: state.date ?? undefined,
      ticketTier: state.tier ?? undefined,
      priceRange: state.priceRange ?? undefined,
      minTickets: state.qty ?? 1,
    },
    setFilters: (filters) =>
      void setState({
        governorate: filters.governorate ?? null,
        date: filters.date ?? null,
        tier: filters.ticketTier ?? null,
        priceRange: filters.priceRange ?? null,
        qty: countParam(filters.minTickets),
      }),
    reset: () => void setState(null),
  };
}

export function useGuideFilters(): ListingFiltersState<GuideFilters> {
  const [state, setState] = useQueryStates(GUIDE_FILTER_PARSERS, URL_OPTIONS);
  return {
    filters: {
      governorate: state.governorate ?? undefined,
      language: state.language ?? undefined,
      specialty: state.specialty ?? undefined,
      duration: state.duration ?? undefined,
      priceRange: state.priceRange ?? undefined,
    },
    setFilters: (filters) =>
      void setState({
        governorate: filters.governorate ?? null,
        language: filters.language ?? null,
        specialty: filters.specialty ?? null,
        duration: filters.duration ?? null,
        priceRange: filters.priceRange ?? null,
      }),
    reset: () => void setState(null),
  };
}
