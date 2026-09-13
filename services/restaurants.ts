import { getMockRestaurant, listMockRestaurants, type Restaurant, type RestaurantFilters } from "@/lib/mock/restaurants";

export async function listRestaurants(filters: RestaurantFilters = {}): Promise<Restaurant[]> {
  return listMockRestaurants(filters);
}

export async function getRestaurant(id: string): Promise<Restaurant | null> {
  return getMockRestaurant(id) ?? null;
}
