import type { ReactNode } from "react";

import { RestaurantCatalog } from "@/components/restaurants/RestaurantCatalog";
import { GOVERNORATES, type GovernorateSlug } from "@/lib/mock/landing";
import type { RestaurantFilters, RestaurantPriceRange, RestaurantZoneId } from "@/lib/mock/restaurants";
import { firstSearchValue, type ListingSearchParams } from "@/lib/search/listingParams";

const ZONES: RestaurantZoneId[] = ["indoor", "terrace", "vip", "smoking"];
const PRICES: RestaurantPriceRange[] = ["under75", "75to150", "over150"];

function parseParty(value: string | undefined): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 12 ? parsed : 2;
}

function parseGovernorate(value: string | undefined): GovernorateSlug | undefined {
  return GOVERNORATES.some((item) => item.slug === value) ? value as GovernorateSlug : undefined;
}

function parseZone(value: string | undefined): RestaurantZoneId | undefined {
  return ZONES.includes(value as RestaurantZoneId) ? value as RestaurantZoneId : undefined;
}

function parsePrice(value: string | undefined): RestaurantPriceRange | undefined {
  return PRICES.includes(value as RestaurantPriceRange) ? value as RestaurantPriceRange : undefined;
}

export async function RestaurantCatalogScreen({
  searchParams,
  detailBasePath = "/restaurants",
}: {
  searchParams: ListingSearchParams;
  detailBasePath?: string;
}): Promise<ReactNode> {
  const params = await searchParams;
  const initialFilters: RestaurantFilters = {
    governorate: parseGovernorate(firstSearchValue(params.governorate)),
    zone: parseZone(firstSearchValue(params.zone)),
    priceRange: parsePrice(firstSearchValue(params.priceRange)),
    partySize: parseParty(firstSearchValue(params.partySize)),
    amenities: [],
  };
  return <RestaurantCatalog initialFilters={initialFilters} detailBasePath={detailBasePath} />;
}
