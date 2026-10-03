"use client";

import { CalendarDays, Hotel as HotelIcon } from "lucide-react";
import { useLocale } from "next-intl";
import type { ReactNode } from "react";

import { HotelCard } from "@/components/hotels/HotelCard";
import { HotelFiltersPanel } from "@/components/hotels/HotelFiltersPanel";
import { ListingFiltersLayout } from "@/components/listings/ListingFiltersLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import type { FilterChip } from "@/components/ui/FilterChips";
import { Skeleton } from "@/components/ui/Skeleton";
import { useBookingSearch } from "@/hooks/useBookingSearch";
import { useHotels } from "@/hooks/useHotels";
import { useHotelFilters } from "@/hooks/useListingFilters";
import type { Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/translations";
import { formatMediumDate } from "@/lib/format/datetime";
import type { HotelFilters } from "@/lib/mock/hotels";

type HotelCatalogProps = {
  detailBasePath?: string;
};

function HotelCatalogSkeleton(): ReactNode {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} className="aspect-[4/5]" />
      ))}
    </div>
  );
}

export function HotelCatalog({ detailBasePath = "/hotels" }: HotelCatalogProps): ReactNode {
  const t = useTranslations("hotels");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const tFilters = useTranslations("hotels.filters");
  const tGov = useTranslations("landing.governorates");
  const tAmenities = useTranslations("hotels.amenities");
  const tRooms = useTranslations("hotels.roomTypes");
  const { filters, setFilters, reset } = useHotelFilters();
  const { checkIn, checkOut } = useBookingSearch();
  const hotelsQuery = useHotels(filters);

  function patch(next: Partial<HotelFilters>): () => void {
    return () => setFilters({ ...filters, ...next });
  }

  const chips: FilterChip[] = [];
  if (filters.governorate) {
    chips.push({ id: "governorate", label: tFilters("governorate"), value: tGov(filters.governorate), onRemove: patch({ governorate: undefined }) });
  }
  if (filters.priceRange) {
    chips.push({ id: "priceRange", label: tFilters("price"), value: tFilters(`prices.${filters.priceRange}`), onRemove: patch({ priceRange: undefined }) });
  }
  if (filters.roomType) {
    chips.push({ id: "roomType", label: tFilters("roomType"), value: tRooms(filters.roomType), onRemove: patch({ roomType: undefined }) });
  }
  if ((filters.guests ?? 1) > 1) {
    chips.push({ id: "guests", label: tFilters("guests"), value: tFilters("guestCount", { count: filters.guests ?? 1 }), onRemove: patch({ guests: 1 }) });
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
        <HotelFiltersPanel embedded={embedded} filters={filters} onChange={setFilters} onReset={reset} />
      )}
      resetLabel={tFilters("reset")}
      showResultsLabel={tFilters("showResults")}
      onReset={reset}
      chips={chips}
      summary={
        <p className="text-prose-muted text-sm">
          {t("resultCount", { count: hotelsQuery.data?.length ?? 0 })}
        </p>
      }
      badges={
        checkIn || checkOut ? (
          <Badge icon={<CalendarDays className="size-3.5" aria-hidden />}>
            {checkIn && checkOut
              ? t("searchDates", {
                  checkIn: formatMediumDate(checkIn, loc),
                  checkOut: formatMediumDate(checkOut, loc),
                })
              : t("oneSearchDate", { date: formatMediumDate(checkIn ?? checkOut ?? "", loc) })}
          </Badge>
        ) : null
      }
    >
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
            <Button variant="outline" size="sm" onClick={reset}>
              {t("states.clearFilters")}
            </Button>
          }
        />
      ) : null}
      {hotelsQuery.isSuccess && hotelsQuery.data.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {hotelsQuery.data.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} detailBasePath={detailBasePath} />
          ))}
        </div>
      ) : null}
    </ListingFiltersLayout>
  );
}
