"use client";

import { UtensilsCrossed } from "lucide-react";
import type { ReactNode } from "react";

import { ListingFiltersLayout } from "@/components/listings/ListingFiltersLayout";
import { RestaurantCard } from "@/components/restaurants/RestaurantCard";
import { RestaurantFiltersPanel } from "@/components/restaurants/RestaurantFiltersPanel";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import type { FilterChip } from "@/components/ui/FilterChips";
import { Skeleton } from "@/components/ui/Skeleton";
import { useRestaurantFilters } from "@/hooks/useListingFilters";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useTranslations } from "@/i18n/translations";
import type { RestaurantFilters } from "@/lib/mock/restaurants";
import { RESTAURANT_DEFAULT_PARTY } from "@/lib/search/listingFilters";

type RestaurantCatalogProps = {
  detailBasePath?: string;
};

export function RestaurantCatalog({
  detailBasePath = "/restaurants",
}: RestaurantCatalogProps): ReactNode {
  const t = useTranslations("restaurants");
  const tFilters = useTranslations("restaurants.filters");
  const tGov = useTranslations("landing.governorates");
  const tZones = useTranslations("restaurants.zones");
  const tAmenities = useTranslations("restaurants.amenities");
  const { filters, setFilters, reset } = useRestaurantFilters();
  const query = useRestaurants(filters);

  function patch(next: Partial<RestaurantFilters>): () => void {
    return () => setFilters({ ...filters, ...next });
  }

  const partySize = filters.partySize ?? RESTAURANT_DEFAULT_PARTY;
  const chips: FilterChip[] = [];
  if (filters.governorate) {
    chips.push({
      id: "governorate",
      label: tFilters("governorate"),
      value: tGov(filters.governorate),
      onRemove: patch({ governorate: undefined }),
    });
  }
  if (filters.priceRange) {
    chips.push({
      id: "priceRange",
      label: tFilters("price"),
      value: tFilters(`prices.${filters.priceRange}`),
      onRemove: patch({ priceRange: undefined }),
    });
  }
  if (filters.zone) {
    chips.push({
      id: "zone",
      label: tFilters("zone"),
      value: tZones(filters.zone),
      onRemove: patch({ zone: undefined }),
    });
  }
  if (partySize !== RESTAURANT_DEFAULT_PARTY) {
    chips.push({
      id: "partySize",
      label: tFilters("partySize"),
      value: tFilters("partyCount", { count: partySize }),
      onRemove: patch({ partySize: RESTAURANT_DEFAULT_PARTY }),
    });
  }
  for (const amenity of filters.amenities ?? []) {
    chips.push({
      id: `amenity-${amenity}`,
      label: tFilters("amenities"),
      value: tAmenities(amenity),
      onRemove: patch({ amenities: (filters.amenities ?? []).filter((item) => item !== amenity) }),
    });
  }

  return (
    <ListingFiltersLayout
      renderFilters={(embedded) => (
        <RestaurantFiltersPanel
          embedded={embedded}
          filters={filters}
          onChange={setFilters}
          onReset={reset}
        />
      )}
      drawerTitle={tFilters("title")}
      resetLabel={tFilters("reset")}
      showResultsLabel={tFilters("showResults")}
      onReset={reset}
      chips={chips}
      summary={
        <p className="text-prose-muted text-sm">
          {t("resultCount", { count: query.data?.length ?? 0 })}
        </p>
      }
    >
      {query.isPending ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="aspect-[4/5]" />
          ))}
        </div>
      ) : null}
      {query.isError ? (
        <ErrorState
          title={t("states.errorTitle")}
          description={t("states.errorDescription")}
          retryLabel={t("states.retry")}
          onRetry={() => void query.refetch()}
        />
      ) : null}
      {query.isSuccess && query.data.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title={t("states.emptyTitle")}
          description={t("states.emptyDescription")}
          action={
            <Button variant="outline" size="sm" onClick={reset}>
              {t("states.clearFilters")}
            </Button>
          }
        />
      ) : null}
      {query.isSuccess && query.data.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {query.data.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              detailBasePath={detailBasePath}
            />
          ))}
        </div>
      ) : null}
    </ListingFiltersLayout>
  );
}
