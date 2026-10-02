"use client";

import { Compass } from "lucide-react";
import { useLocale } from "next-intl";
import type { ReactNode } from "react";

import { ListingFiltersLayout } from "@/components/listings/ListingFiltersLayout";
import { TripCard } from "@/components/trips/TripCard";
import { TripFiltersPanel } from "@/components/trips/TripFiltersPanel";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import type { FilterChip } from "@/components/ui/FilterChips";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTripFilters } from "@/hooks/useListingFilters";
import { useTrips } from "@/hooks/useTrips";
import type { Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/translations";
import { formatMediumDate } from "@/lib/format/datetime";
import { formatCount } from "@/lib/format/number";
import type { TripFilters } from "@/lib/mock/trips";

export function TripCatalog({ detailBasePath = "/trips" }: { detailBasePath?: string }): ReactNode {
  const t = useTranslations("trips");
  const tf = useTranslations("trips.filters");
  const td = useTranslations("trips.durations");
  const tGov = useTranslations("landing.governorates");
  const locale: Locale = useLocale() === "ar" ? "ar" : "en";
  const { filters, setFilters, reset } = useTripFilters();
  const query = useTrips(filters);

  function patch(next: Partial<TripFilters>): () => void {
    return () => setFilters({ ...filters, ...next });
  }

  const chips: FilterChip[] = [];
  if (filters.governorate) chips.push({ id: "governorate", label: tf("governorate"), value: tGov(filters.governorate), onRemove: patch({ governorate: undefined }) });
  if (filters.date) chips.push({ id: "date", label: tf("date"), value: formatMediumDate(filters.date, locale), onRemove: patch({ date: undefined }) });
  if (filters.duration) chips.push({ id: "duration", label: tf("duration"), value: td(filters.duration), onRemove: patch({ duration: undefined }) });
  if (filters.priceRange) chips.push({ id: "priceRange", label: tf("price"), value: tf(`prices.${filters.priceRange}`), onRemove: patch({ priceRange: undefined }) });
  if ((filters.minSeats ?? 1) > 1) chips.push({ id: "seats", label: tf("seats"), value: formatCount(filters.minSeats ?? 1, locale), onRemove: patch({ minSeats: 1 }) });

  return (
    <ListingFiltersLayout
      renderFilters={(embedded) => <TripFiltersPanel embedded={embedded} filters={filters} onChange={setFilters} onReset={reset} />}
      drawerTitle={tf("title")}
      resetLabel={tf("reset")}
      showResultsLabel={tf("showResults")}
      onReset={reset}
      chips={chips}
      summary={<p className="text-prose-muted text-sm">{t("resultCount", { count: query.data?.length ?? 0 })}</p>}
    >
      {query.isPending ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="aspect-[4/5]" />)}</div> : null}
      {query.isError ? <ErrorState title={t("states.errorTitle")} description={t("states.errorDescription")} retryLabel={t("states.retry")} onRetry={() => void query.refetch()} /> : null}
      {query.isSuccess && query.data.length === 0 ? <EmptyState icon={Compass} title={t("states.emptyTitle")} description={t("states.emptyDescription")} action={<Button variant="outline" size="sm" onClick={reset}>{t("states.clearFilters")}</Button>} /> : null}
      {query.isSuccess && query.data.length > 0 ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{query.data.map((trip) => <TripCard key={trip.id} trip={trip} detailBasePath={detailBasePath} />)}</div> : null}
    </ListingFiltersLayout>
  );
}
