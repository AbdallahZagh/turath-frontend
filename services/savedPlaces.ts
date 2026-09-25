import { getMockSavedPlaces, toggleMockSavedPlace, type SavedPlace } from "@/lib/mock/savedPlaces";

export async function getSavedPlaces(): Promise<SavedPlace[]> {
  return getMockSavedPlaces();
}

export async function toggleSavedPlace(place: SavedPlace): Promise<{ place: SavedPlace; saved: boolean }> {
  return toggleMockSavedPlace(place);
}
