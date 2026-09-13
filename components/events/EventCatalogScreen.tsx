import type { ReactNode } from "react";

import { EventCatalog } from "@/components/events/EventCatalog";
import type { EventFilters, EventPriceRange, EventTierId } from "@/lib/mock/events";
import { GOVERNORATES, type GovernorateSlug } from "@/lib/mock/landing";
import { firstSearchValue, type ListingSearchParams } from "@/lib/search/listingParams";

const TIERS: EventTierId[] = ["standard", "vip"];
const PRICES: EventPriceRange[] = ["under100", "100to250", "over250"];
function parseTickets(value: string | undefined): number { const parsed = Number(value); return Number.isInteger(parsed) && parsed >= 1 && parsed <= 6 ? parsed : 1; }
function parseGovernorate(value: string | undefined): GovernorateSlug | undefined { return GOVERNORATES.some((item) => item.slug === value) ? value as GovernorateSlug : undefined; }
function parseTier(value: string | undefined): EventTierId | undefined { return TIERS.includes(value as EventTierId) ? value as EventTierId : undefined; }
function parsePrice(value: string | undefined): EventPriceRange | undefined { return PRICES.includes(value as EventPriceRange) ? value as EventPriceRange : undefined; }

export async function EventCatalogScreen({ searchParams, detailBasePath = "/events" }: { searchParams: ListingSearchParams; detailBasePath?: string }): Promise<ReactNode> {
  const params = await searchParams;
  const initialFilters: EventFilters = { governorate: parseGovernorate(firstSearchValue(params.governorate)), date: firstSearchValue(params.date), ticketTier: parseTier(firstSearchValue(params.tier)), minTickets: parseTickets(firstSearchValue(params.tickets)), priceRange: parsePrice(firstSearchValue(params.priceRange)) };
  return <EventCatalog initialFilters={initialFilters} detailBasePath={detailBasePath} />;
}
