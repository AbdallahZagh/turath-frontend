import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { Trip, TripFilters } from "@/lib/mock/trips";
import { getTrip, listTrips } from "@/services/trips";

const TRIP_STALE_TIME = 5 * 60_000;

export function useTrips(filters: TripFilters): UseQueryResult<Trip[]> {
  return useQuery({ queryKey: ["public", "trips", filters], queryFn: () => listTrips(filters), staleTime: TRIP_STALE_TIME });
}

export function useTrip(id: string): UseQueryResult<Trip | null> {
  return useQuery({ queryKey: ["public", "trips", id], queryFn: () => getTrip(id), enabled: Boolean(id), staleTime: TRIP_STALE_TIME });
}
