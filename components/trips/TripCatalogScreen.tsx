import type { ReactNode } from "react";

import { TripCatalog } from "@/components/trips/TripCatalog";
import { GOVERNORATES, type GovernorateSlug } from "@/lib/mock/landing";
import type { TripDurationId, TripFilters, TripPriceRange } from "@/lib/mock/trips";
import { firstSearchValue, type ListingSearchParams } from "@/lib/search/listingParams";

const DURATIONS: TripDurationId[] = ["halfDay", "fullDay", "multiDay"];
const PRICES: TripPriceRange[] = ["under200", "200to400", "over400"];

function parseSeats(value: string | undefined): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 12 ? parsed : 1;
}

function parseGovernorate(value: string | undefined): GovernorateSlug | undefined {
  return GOVERNORATES.some((item) => item.slug === value) ? value as GovernorateSlug : undefined;
}

function parseDuration(value: string | undefined): TripDurationId | undefined {
  return DURATIONS.includes(value as TripDurationId) ? value as TripDurationId : undefined;
}

function parsePrice(value: string | undefined): TripPriceRange | undefined {
  return PRICES.includes(value as TripPriceRange) ? value as TripPriceRange : undefined;
}

export async function TripCatalogScreen({ searchParams, detailBasePath = "/trips" }: { searchParams: ListingSearchParams; detailBasePath?: string }): Promise<ReactNode> {
  const params = await searchParams;
  const initialFilters: TripFilters = {
    governorate: parseGovernorate(firstSearchValue(params.governorate)),
    date: firstSearchValue(params.date),
    minSeats: parseSeats(firstSearchValue(params.seats)),
    duration: parseDuration(firstSearchValue(params.duration)),
    priceRange: parsePrice(firstSearchValue(params.priceRange)),
  };
  return <TripCatalog initialFilters={initialFilters} detailBasePath={detailBasePath} />;
}
