import { getMockTrip, listMockTrips, type Trip, type TripFilters } from "@/lib/mock/trips";

export async function listTrips(filters: TripFilters = {}): Promise<Trip[]> {
  return listMockTrips(filters);
}

export async function getTrip(id: string): Promise<Trip | null> {
  return getMockTrip(id) ?? null;
}
