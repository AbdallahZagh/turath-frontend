import type { ReactNode } from "react";

import { GuideCatalog } from "@/components/guides/GuideCatalog";
import type { GuideDurationId, GuideFilters, GuideLanguageId, GuidePriceRange, GuideSpecialtyId } from "@/lib/mock/guides";
import type { ListingSearchParams } from "@/lib/search/listingParams";

function first(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }
function oneOf<T extends string>(value: string | undefined, options: readonly T[]): T | undefined { return options.includes(value as T) ? value as T : undefined; }
export async function GuideCatalogScreen({ searchParams, detailBasePath = "/guides" }: { searchParams: ListingSearchParams; detailBasePath?: string }): Promise<ReactNode> {
  const params = await searchParams;
  const filters: GuideFilters = { governorate: first(params.governorate) as GuideFilters["governorate"], language: oneOf<GuideLanguageId>(first(params.language), ["arabic", "english", "french", "german"]), specialty: oneOf<GuideSpecialtyId>(first(params.specialty), ["history", "architecture", "food", "photography", "hiking"]), duration: oneOf<GuideDurationId>(first(params.duration), ["hourly", "halfDay", "fullDay"]), priceRange: oneOf<GuidePriceRange>(first(params.priceRange), ["under100", "100to250", "over250"]) };
  return <GuideCatalog initialFilters={filters} detailBasePath={detailBasePath} />;
}
