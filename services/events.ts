import { getMockEvent, listMockEvents, type EventFilters, type TourismEvent } from "@/lib/mock/events";

export async function listEvents(filters: EventFilters = {}): Promise<TourismEvent[]> {
  return listMockEvents(filters);
}

export async function getEvent(id: string): Promise<TourismEvent | null> {
  return getMockEvent(id) ?? null;
}
