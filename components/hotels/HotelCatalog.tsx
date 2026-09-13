"use client";

import { CalendarDays, Hotel as HotelIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { HotelCard } from "@/components/hotels/HotelCard";
import { HotelFiltersPanel } from "@/components/hotels/HotelFiltersPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
  const [filters, setFilters] = useState<HotelFilters>(initialFilters);
  const hotelsQuery = useHotels(filters);

  return (
    <div className="grid items-start gap-7 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <HotelFiltersPanel
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      <section aria-live="polite" className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-prose-muted text-sm">
            {t("resultCount", { count: hotelsQuery.data?.length ?? 0 })}
          </p>
          {checkIn || checkOut ? (
            <Badge icon={<CalendarDays className="size-3.5" aria-hidden />}>
              {checkIn && checkOut
                ? t("searchDates", { checkIn, checkOut })
                : t("oneSearchDate", { date: checkIn ?? checkOut ?? "" })}
            </Badge>
          ) : null}
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
              <Button variant="outline" size="sm" onClick={() => setFilters(DEFAULT_FILTERS)}>
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
    </div>
  );
}
