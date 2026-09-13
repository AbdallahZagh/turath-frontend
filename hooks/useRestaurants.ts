import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { Restaurant, RestaurantFilters } from "@/lib/mock/restaurants";
import { getRestaurant, listRestaurants } from "@/services/restaurants";

const RESTAURANT_STALE_TIME = 5 * 60_000;

export function useRestaurants(filters: RestaurantFilters): UseQueryResult<Restaurant[]> {
  return useQuery({ queryKey: ["public", "restaurants", filters], queryFn: () => listRestaurants(filters), staleTime: RESTAURANT_STALE_TIME });
}

export function useRestaurant(id: string): UseQueryResult<Restaurant | null> {
  return useQuery({ queryKey: ["public", "restaurants", id], queryFn: () => getRestaurant(id), enabled: Boolean(id), staleTime: RESTAURANT_STALE_TIME });
}
