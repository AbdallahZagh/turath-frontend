"use client";

import { UtensilsCrossed } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { RestaurantCard } from "@/components/restaurants/RestaurantCard";
import { RestaurantFiltersPanel } from "@/components/restaurants/RestaurantFiltersPanel";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useRestaurants } from "@/hooks/useRestaurants";
import type { RestaurantFilters } from "@/lib/mock/restaurants";

const DEFAULT_FILTERS: RestaurantFilters = { partySize: 2, amenities: [] };

export function RestaurantCatalog({ initialFilters, detailBasePath = "/restaurants" }: { initialFilters: RestaurantFilters; detailBasePath?: string }): ReactNode {
  const t = useTranslations("restaurants");
  const [filters, setFilters] = useState(initialFilters);
  const query = useRestaurants(filters);
  return (
    <div className="grid items-start gap-7 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <RestaurantFiltersPanel filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} />
      <section aria-live="polite" className="min-w-0">
        <p className="text-prose-muted mb-5 text-sm">{t("resultCount", { count: query.data?.length ?? 0 })}</p>
        {query.isPending ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="aspect-[4/5]" />)}</div> : null}
        {query.isError ? <ErrorState title={t("states.errorTitle")} description={t("states.errorDescription")} retryLabel={t("states.retry")} onRetry={() => void query.refetch()} /> : null}
        {query.isSuccess && query.data.length === 0 ? <EmptyState icon={UtensilsCrossed} title={t("states.emptyTitle")} description={t("states.emptyDescription")} action={<Button variant="outline" size="sm" onClick={() => setFilters(DEFAULT_FILTERS)}>{t("states.clearFilters")}</Button>} /> : null}
        {query.isSuccess && query.data.length > 0 ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{query.data.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} detailBasePath={detailBasePath} />)}</div> : null}
      </section>
    </div>
  );
}
