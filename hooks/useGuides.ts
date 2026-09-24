import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { GuideFilters, TourGuide } from "@/lib/mock/guides";
import { getGuide, listGuides } from "@/services/guides";

const STALE_TIME = 5 * 60_000;
export function useGuides(filters: GuideFilters): UseQueryResult<TourGuide[]> { return useQuery({ queryKey: ["public", "guides", filters], queryFn: () => listGuides(filters), staleTime: STALE_TIME }); }
export function useGuide(id: string): UseQueryResult<TourGuide | null> { return useQuery({ queryKey: ["public", "guides", id], queryFn: () => getGuide(id), enabled: Boolean(id), staleTime: STALE_TIME }); }
