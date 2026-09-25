export type SavedPlaceCategory = "hotels" | "restaurants" | "trips" | "events" | "guides" | "attractions";

export type SavedPlace = {
  id: string;
  category: SavedPlaceCategory;
  name: { en: string; ar: string };
  governorate: GovernorateSlug;
  imageSrc: string;
  href: string;
};

let savedPlaces: SavedPlace[] = [
  { id: "hotel-dar-al-yasmin", category: "hotels", name: { en: "Dar Al Yasmin", ar: "دار الياسمين" }, governorate: "damascus", imageSrc: "/images/hotels/damascus-courtyard.webp", href: "/user/hotels/dar-al-yasmin" },
  { id: "krak-valley-day", category: "trips", name: { en: "Krak and Valley Day", ar: "يوم في قلعة الحصن والوادي" }, governorate: "homs", imageSrc: "/images/landing/site-krak-des-chevaliers.png", href: "/user/trips/krak-valley-day" },
  { id: "attraction-umayyad-mosque", category: "attractions", name: { en: "Umayyad Mosque", ar: "الجامع الأموي" }, governorate: "damascus", imageSrc: "/images/landing/site-umayyad-mosque.png", href: "/user/attractions/umayyad-mosque" },
];

function clone(place: SavedPlace): SavedPlace {
  return { ...place, name: { ...place.name } };
}

export function getMockSavedPlaces(): SavedPlace[] {
  return savedPlaces.map(clone);
}

export function toggleMockSavedPlace(place: SavedPlace): { place: SavedPlace; saved: boolean } {
  const existing = savedPlaces.some((item) => item.id === place.id && item.category === place.category);
  if (existing) {
    savedPlaces = savedPlaces.filter((item) => item.id !== place.id || item.category !== place.category);
    return { place: clone(place), saved: false };
  }
  savedPlaces = [clone(place), ...savedPlaces];
  return { place: clone(place), saved: true };
}
import type { GovernorateSlug } from "@/lib/mock/landing";
