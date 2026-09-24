import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { getAttraction, listAttractions, type AttractionFilters, type TouristAttraction } from "@/services/attractions";

const STALE_TIME = 5 * 60_000;

export function useAttractions(filters: AttractionFilters): UseQueryResult<TouristAttraction[]> {
  return useQuery({ queryKey: ["public", "attractions", filters], queryFn: () => listAttractions(filters), staleTime: STALE_TIME });
}

export function useAttraction(slug: string): UseQueryResult<TouristAttraction | null> {
  return useQuery({ queryKey: ["public", "attractions", slug], queryFn: () => getAttraction(slug), enabled: Boolean(slug), staleTime: STALE_TIME });
}
