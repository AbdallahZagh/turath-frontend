import type { LocalizedName } from "@/lib/i18n/localized";
import type { GovernorateSlug } from "@/lib/mock/landing";
import { listAttractions } from "@/services/attractions";
import { listEvents } from "@/services/events";
import { listGuides } from "@/services/guides";
import { listHotels } from "@/services/hotels";
import { listRestaurants } from "@/services/restaurants";
import { listTrips } from "@/services/trips";

export const DISCOVERY_CATEGORIES = ["attraction", "hotel", "restaurant", "trip", "event", "guide"] as const;
export type DiscoveryCategory = (typeof DISCOVERY_CATEGORIES)[number];
export const DISCOVERY_AMENITIES = ["generator", "wifi", "ac"] as const;
export type DiscoveryAmenity = (typeof DISCOVERY_AMENITIES)[number];

export type DiscoveryFilters = {
  query?: string;
  category?: DiscoveryCategory;
  governorate?: GovernorateSlug;
  radiusKm?: number;
  maxPriceSyp?: number;
  amenities?: DiscoveryAmenity[];
  smoking?: boolean;
  accessible?: boolean;
};

export type DiscoveryResult = {
  key: string;
  id: string;
  category: DiscoveryCategory;
  name: LocalizedName;
  description: LocalizedName;
  governorate: GovernorateSlug;
  coordinates: { latitude: number; longitude: number };
  imageSrc: string;
  priceSyp: number;
  rating: number | null;
  detailHref: string;
  amenities: DiscoveryAmenity[];
  smoking: boolean;
  accessible: boolean;
};

const SYRIA_CENTER = { latitude: 35.0, longitude: 38.0 };
const GOVERNORATE_CENTERS: Record<GovernorateSlug, { latitude: number; longitude: number }> = {
  damascus: { latitude: 33.5138, longitude: 36.2765 }, aleppo: { latitude: 36.2021, longitude: 37.1343 },
  latakia: { latitude: 35.5317, longitude: 35.7901 }, tartus: { latitude: 34.889, longitude: 35.8866 },
  homs: { latitude: 34.7324, longitude: 36.7137 }, hama: { latitude: 35.1318, longitude: 36.7578 },
  palmyra: { latitude: 34.5628, longitude: 38.2851 }, bosra: { latitude: 32.5189, longitude: 36.4814 },
};

function radians(value: number): number { return value * Math.PI / 180; }
function distanceKm(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): number {
  const earthRadiusKm = 6371; const latitudeDelta = radians(b.latitude - a.latitude); const longitudeDelta = radians(b.longitude - a.longitude);
  const value = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(radians(a.latitude)) * Math.cos(radians(b.latitude)) * Math.sin(longitudeDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function matchesQuery(result: DiscoveryResult, query: string): boolean {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return true;
  return [result.name.en, result.name.ar, result.description.en, result.description.ar, result.governorate, result.category]
    .some((value) => value.toLocaleLowerCase().includes(needle));
}

export async function listDiscoveryResults(filters: DiscoveryFilters = {}): Promise<DiscoveryResult[]> {
  const [attractions, hotels, restaurants, trips, events, guides] = await Promise.all([
    listAttractions(), listHotels({}), listRestaurants({}), listTrips({}), listEvents({}), listGuides({}),
  ]);
  const results: DiscoveryResult[] = [
    ...attractions.map((item): DiscoveryResult => ({ key: `attraction:${item.id}`, id: item.id, category: "attraction", name: item.name, description: item.narrative, governorate: item.governorate, coordinates: { latitude: item.latitude, longitude: item.longitude }, imageSrc: item.imageSrc, priceSyp: item.entryFeeSyp, rating: null, detailHref: `/attractions/${item.slug}`, amenities: [], smoking: false, accessible: false })),
    ...hotels.map((item): DiscoveryResult => ({ key: `hotel:${item.id}`, id: item.id, category: "hotel", name: item.name, description: item.shortDescription, governorate: item.governorate, coordinates: item.coordinates, imageSrc: item.imageSrc, priceSyp: Math.min(...item.rooms.map((room) => room.priceSyp)), rating: item.rating, detailHref: `/hotels/${item.id}`, amenities: item.amenities.filter((amenity): amenity is DiscoveryAmenity => DISCOVERY_AMENITIES.includes(amenity as DiscoveryAmenity)), smoking: false, accessible: item.amenities.includes("accessible") })),
    ...restaurants.map((item): DiscoveryResult => ({ key: `restaurant:${item.id}`, id: item.id, category: "restaurant", name: item.name, description: item.shortDescription, governorate: item.governorate, coordinates: item.coordinates, imageSrc: item.imageSrc, priceSyp: Math.min(...item.zones.map((zone) => zone.pricePerGuestSyp)), rating: item.rating, detailHref: `/restaurants/${item.id}`, amenities: item.amenities.filter((amenity): amenity is DiscoveryAmenity => DISCOVERY_AMENITIES.includes(amenity as DiscoveryAmenity)), smoking: item.zones.some((zone) => zone.id === "smoking"), accessible: item.amenities.includes("accessible") })),
    ...trips.map((item): DiscoveryResult => ({ key: `trip:${item.id}`, id: item.id, category: "trip", name: item.name, description: item.shortDescription, governorate: item.governorate, coordinates: item.coordinates, imageSrc: item.imageSrc, priceSyp: item.pricePerSeatSyp, rating: item.rating, detailHref: `/trips/${item.id}`, amenities: [], smoking: false, accessible: false })),
    ...events.map((item): DiscoveryResult => ({ key: `event:${item.id}`, id: item.id, category: "event", name: item.name, description: item.shortDescription, governorate: item.governorate, coordinates: item.coordinates, imageSrc: item.imageSrc, priceSyp: Math.min(...item.sessions.flatMap((session) => session.tiers.map((tier) => tier.priceSyp))), rating: item.rating, detailHref: `/events/${item.id}`, amenities: [], smoking: false, accessible: item.features.includes("accessible") })),
    ...guides.map((item): DiscoveryResult => ({ key: `guide:${item.id}`, id: item.id, category: "guide", name: item.name, description: item.shortDescription, governorate: item.governorate, coordinates: item.coordinates, imageSrc: item.imageSrc, priceSyp: item.rates.hourly, rating: item.rating, detailHref: `/guides/${item.id}`, amenities: [], smoking: false, accessible: false })),
  ];
  const origin = filters.governorate ? GOVERNORATE_CENTERS[filters.governorate] : SYRIA_CENTER;
  return results.filter((result) => {
    if (filters.query && !matchesQuery(result, filters.query)) return false;
    if (filters.category && result.category !== filters.category) return false;
    if (filters.governorate && result.governorate !== filters.governorate) return false;
    if (filters.radiusKm && distanceKm(origin, result.coordinates) > filters.radiusKm) return false;
    if (filters.maxPriceSyp && result.priceSyp > filters.maxPriceSyp) return false;
    if (filters.amenities?.some((amenity) => !result.amenities.includes(amenity))) return false;
    if (filters.smoking && !result.smoking) return false;
    if (filters.accessible && !result.accessible) return false;
    return true;
  });
}
