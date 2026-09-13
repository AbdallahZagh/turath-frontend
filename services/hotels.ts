import {
  getMockHotel,
  listMockHotels,
  type Hotel,
  type HotelFilters,
} from "@/lib/mock/hotels";

export async function listHotels(filters: HotelFilters = {}): Promise<Hotel[]> {
  return listMockHotels(filters);
}

export async function getHotel(id: string): Promise<Hotel | null> {
  return getMockHotel(id) ?? null;
}
