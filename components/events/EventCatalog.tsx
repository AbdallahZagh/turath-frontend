"use client";

import { CalendarHeart } from "lucide-react";
import { useLocale } from "next-intl";
import type { ReactNode } from "react";

import { EventCard } from "@/components/events/EventCard";
import { EventFiltersPanel } from "@/components/events/EventFiltersPanel";
import { ListingFiltersLayout } from "@/components/listings/ListingFiltersLayout";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import type { FilterChip } from "@/components/ui/FilterChips";
import { Skeleton } from "@/components/ui/Skeleton";
import { useEvents } from "@/hooks/useEvents";
import { useEventFilters } from "@/hooks/useListingFilters";
import type { Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/translations";
import { formatMediumDate } from "@/lib/format/datetime";
import { formatCount } from "@/lib/format/number";
import type { EventFilters } from "@/lib/mock/events";

export function EventCatalog({ detailBasePath = "/events" }: { detailBasePath?: string }): ReactNode {
  const t = useTranslations("events");
  const tf = useTranslations("events.filters");
  const tt = useTranslations("events.tiers");
  const tGov = useTranslations("landing.governorates");
  const locale: Locale = useLocale() === "ar" ? "ar" : "en";
  const { filters, setFilters, reset } = useEventFilters();
  const query = useEvents(filters);

  function patch(next: Partial<EventFilters>): () => void {
    return () => setFilters({ ...filters, ...next });
  }

  const chips: FilterChip[] = [];
  if (filters.governorate) chips.push({ id: "governorate", label: tf("governorate"), value: tGov(filters.governorate), onRemove: patch({ governorate: undefined }) });
  if (filters.date) chips.push({ id: "date", label: tf("date"), value: formatMediumDate(filters.date, locale), onRemove: patch({ date: undefined }) });
  if (filters.ticketTier) chips.push({ id: "tier", label: tf("tier"), value: tt(filters.ticketTier), onRemove: patch({ ticketTier: undefined }) });
  if (filters.priceRange) chips.push({ id: "priceRange", label: tf("price"), value: tf(`prices.${filters.priceRange}`), onRemove: patch({ priceRange: undefined }) });
  if ((filters.minTickets ?? 1) > 1) chips.push({ id: "qty", label: tf("tickets"), value: formatCount(filters.minTickets ?? 1, locale), onRemove: patch({ minTickets: 1 }) });

  return (
    <ListingFiltersLayout
      renderFilters={(embedded) => <EventFiltersPanel embedded={embedded} filters={filters} onChange={setFilters} onReset={reset} />}
      drawerTitle={tf("title")}
      resetLabel={tf("reset")}
      showResultsLabel={tf("showResults")}
      onReset={reset}
      chips={chips}
      summary={<p className="text-prose-muted text-sm">{t("resultCount", { count: query.data?.length ?? 0 })}</p>}
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
          icon={CalendarHeart}
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
          {query.data.map((event) => (
            <EventCard key={event.id} event={event} detailBasePath={detailBasePath} />
          ))}
        </div>
      ) : null}
    </ListingFiltersLayout>
  );
}
