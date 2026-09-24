import type { ReactNode } from "react";

import { AttractionCatalog } from "@/components/attractions/AttractionCatalog";
import type { ListingSearchParams } from "@/lib/search/listingParams";
import type { AttractionFilters } from "@/services/attractions";

function first(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }
export async function AttractionCatalogScreen({ searchParams, detailBasePath = "/attractions" }: { searchParams: ListingSearchParams; detailBasePath?: string }): Promise<ReactNode> {
  const params = await searchParams; const open = first(params.openNow); const filters: AttractionFilters = { governorate: first(params.governorate) as AttractionFilters["governorate"], openNow: open === "true" || open === "1" || undefined };
  return <AttractionCatalog initialFilters={filters} detailBasePath={detailBasePath} />;
}
