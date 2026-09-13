import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { EventFilters, TourismEvent } from "@/lib/mock/events";
import { getEvent, listEvents } from "@/services/events";

const EVENT_STALE_TIME = 5 * 60_000;

export function useEvents(filters: EventFilters): UseQueryResult<TourismEvent[]> {
  return useQuery({ queryKey: ["public", "events", filters], queryFn: () => listEvents(filters), staleTime: EVENT_STALE_TIME });
}

export function useEvent(id: string): UseQueryResult<TourismEvent | null> {
  return useQuery({ queryKey: ["public", "events", id], queryFn: () => getEvent(id), enabled: Boolean(id), staleTime: EVENT_STALE_TIME });
}
