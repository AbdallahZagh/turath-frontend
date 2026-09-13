import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { Hotel, HotelFilters } from "@/lib/mock/hotels";
import { getHotel, listHotels } from "@/services/hotels";

const HOTEL_STALE_TIME = 5 * 60_000;

export function useHotels(filters: HotelFilters): UseQueryResult<Hotel[]> {
  return useQuery({
    queryKey: ["public", "hotels", filters],
    queryFn: () => listHotels(filters),
    staleTime: HOTEL_STALE_TIME,
  });
}

export function useHotel(id: string): UseQueryResult<Hotel | null> {
  return useQuery({
    queryKey: ["public", "hotels", id],
    queryFn: () => getHotel(id),
    staleTime: HOTEL_STALE_TIME,
  });
}
