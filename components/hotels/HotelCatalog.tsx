"use client";

import { CalendarDays, Hotel as HotelIcon, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState, type ReactNode } from "react";

import { HotelCard } from "@/components/hotels/HotelCard";
import { HotelFiltersPanel } from "@/components/hotels/HotelFiltersPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useHotels } from "@/hooks/useHotels";
import type { HotelFilters } from "@/lib/mock/hotels";

type HotelCatalogProps = {
  initialFilters: HotelFilters;
  checkIn?: string;
  checkOut?: string;
};

const DEFAULT_FILTERS: HotelFilters = { guests: 1, amenities: [] };

function countActiveFilters(filters: HotelFilters): number {
  let count = 0;
  if (filters.governorate) count += 1;
  if (filters.priceRange) count += 1;
  if (filters.roomType) count += 1;
  if ((filters.guests ?? 1) > 1) count += 1;
  count += filters.amenities?.length ?? 0;
  return count;
}

function HotelCatalogSkeleton(): ReactNode {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} className="aspect-[4/5]" />
      ))}
    </div>
  );
}

export function HotelCatalog({
  initialFilters,
  checkIn,
  checkOut,
}: HotelCatalogProps): ReactNode {
  const t = useTranslations("hotels");
  const tFilters = useTranslations("hotels.filters");
  const [filters, setFilters] = useState<HotelFilters>(initialFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hotelsQuery = useHotels(filters);
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  function resetFilters(): void {
    setFilters(DEFAULT_FILTERS);
  }

  const filtersButtonLabel =
    activeFilterCount > 0
      ? tFilters("openWithCount", { count: activeFilterCount })
      : tFilters("open");

  return (
    <div className="grid items-start gap-7 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <HotelFiltersPanel
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
        />
      </aside>

      <section aria-live="polite" className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-prose-muted text-sm">
            {t("resultCount", { count: hotelsQuery.data?.length ?? 0 })}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {checkIn || checkOut ? (
              <Badge icon={<CalendarDays className="size-3.5" aria-hidden />}>
                {checkIn && checkOut
                  ? t("searchDates", { checkIn, checkOut })
                  : t("oneSearchDate", { date: checkIn ?? checkOut ?? "" })}
              </Badge>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setFiltersOpen(true)}
              aria-expanded={filtersOpen}
            >
              <SlidersHorizontal className="size-3.5" aria-hidden />
              {filtersButtonLabel}
            </Button>
          </div>
        </div>

        {hotelsQuery.isPending ? <HotelCatalogSkeleton /> : null}
        {hotelsQuery.isError ? (
          <ErrorState
            title={t("states.errorTitle")}
            description={t("states.errorDescription")}
            retryLabel={t("states.retry")}
            onRetry={() => void hotelsQuery.refetch()}
          />
        ) : null}
        {hotelsQuery.isSuccess && hotelsQuery.data.length === 0 ? (
          <EmptyState
            icon={HotelIcon}
            title={t("states.emptyTitle")}
            description={t("states.emptyDescription")}
            action={
              <Button variant="outline" size="sm" onClick={resetFilters}>
                {t("states.clearFilters")}
              </Button>
            }
          />
        ) : null}
        {hotelsQuery.isSuccess && hotelsQuery.data.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {hotelsQuery.data.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : null}
      </section>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title={tFilters("title")}
        side="end"
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="glass" size="sm" onClick={resetFilters}>
              {tFilters("reset")}
            </Button>
            <Button size="sm" onClick={() => setFiltersOpen(false)}>
              {tFilters("showResults")}
            </Button>
          </div>
        }
      >
        <HotelFiltersPanel
          embedded
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
        />
      </Drawer>
    </div>
  );
}
