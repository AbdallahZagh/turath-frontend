"use client";

import type { ReactNode } from "react";

import { ListingFiltersPanel } from "@/components/listings/ListingFiltersPanel";
import { Checkbox } from "@/components/ui/Checkbox";
import { Select, type SelectOption } from "@/components/ui/Select";
import { useTranslations } from "@/i18n/translations";
import { GOVERNORATES } from "@/lib/mock/landing";
import type {
  HotelAmenityId,
  HotelFilters,
  HotelPriceRange,
  HotelRoomTypeId,
} from "@/lib/mock/hotels";
import {
  HOTEL_FILTER_AMENITIES,
  HOTEL_MAX_GUESTS,
  HOTEL_PRICE_RANGES,
  HOTEL_ROOM_TYPES,
} from "@/lib/search/listingFilters";

type HotelFiltersPanelProps = {
  filters: HotelFilters;
  onChange: (filters: HotelFilters) => void;
  onReset: () => void;
  /** Skip outer GlassPanel / sticky chrome (e.g. inside a mobile Drawer). */
  embedded?: boolean;
};

export function HotelFiltersPanel({
  filters,
  onChange,
  onReset,
  embedded = false,
}: HotelFiltersPanelProps): ReactNode {
  const t = useTranslations("hotels.filters");
  const tGov = useTranslations("landing.governorates");
  const tAmenities = useTranslations("hotels.amenities");
  const tRooms = useTranslations("hotels.roomTypes");

  const governorateOptions: SelectOption[] = [
    { value: "all", label: t("allGovernorates") },
    ...GOVERNORATES.map((item) => ({ value: item.slug, label: tGov(item.slug) })),
  ];
  const roomOptions: SelectOption[] = [
    { value: "all", label: t("allRoomTypes") },
    ...HOTEL_ROOM_TYPES.map((type) => ({ value: type, label: tRooms(type) })),
  ];
  const priceOptions: SelectOption[] = [
    { value: "all", label: t("allPrices") },
    ...HOTEL_PRICE_RANGES.map((range) => ({ value: range, label: t(`prices.${range}`) })),
  ];
  const guestOptions: SelectOption[] = Array.from({ length: HOTEL_MAX_GUESTS }, (_, index) => ({
    value: String(index + 1),
    label: t("guestCount", { count: index + 1 }),
  }));

  function toggleAmenity(amenity: HotelAmenityId): void {
    const current = filters.amenities ?? [];
    const amenities = current.includes(amenity)
      ? current.filter((item) => item !== amenity)
      : [...current, amenity];
    onChange({ ...filters, amenities });
  }

  return (
    <ListingFiltersPanel title={t("title")} resetLabel={t("reset")} onReset={onReset} embedded={embedded}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <Select
          variant="main"
          size="sm"
          label={t("governorate")}
          options={governorateOptions}
          value={filters.governorate ?? "all"}
          onChange={(value) =>
            onChange({
              ...filters,
              governorate: value === "all" ? undefined : (value as HotelFilters["governorate"]),
            })
          }
        />
        <Select
          variant="main"
          size="sm"
          label={t("price")}
          options={priceOptions}
          value={filters.priceRange ?? "all"}
          onChange={(value) =>
            onChange({
              ...filters,
              priceRange: value === "all" ? undefined : (value as HotelPriceRange),
            })
          }
        />
        <Select
          variant="main"
          size="sm"
          label={t("roomType")}
          options={roomOptions}
          value={filters.roomType ?? "all"}
          onChange={(value) =>
            onChange({
              ...filters,
              roomType: value === "all" ? undefined : (value as HotelRoomTypeId),
            })
          }
        />
        <Select
          variant="main"
          size="sm"
          label={t("guests")}
          options={guestOptions}
          value={String(filters.guests ?? 1)}
          onChange={(value) => onChange({ ...filters, guests: Number(value) })}
        />
      </div>

      <fieldset className="border-border mt-5 border-t pt-5">
        <legend className="text-prose text-sm font-semibold">{t("amenities")}</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {HOTEL_FILTER_AMENITIES.map((amenity) => (
            <label key={amenity} className="text-prose flex cursor-pointer items-center gap-2.5 text-sm">
              <Checkbox
                size="sm"
                checked={(filters.amenities ?? []).includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
              />
              {tAmenities(amenity)}
            </label>
          ))}
        </div>
      </fieldset>
    </ListingFiltersPanel>
  );
}
