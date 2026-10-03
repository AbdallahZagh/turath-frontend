"use client";

import type { ReactNode } from "react";

import { ListingFiltersPanel } from "@/components/listings/ListingFiltersPanel";
import { Checkbox } from "@/components/ui/Checkbox";
import { Select, type SelectOption } from "@/components/ui/Select";
import { useTranslations } from "@/i18n/translations";
import { GOVERNORATES } from "@/lib/mock/landing";
import type {
  RestaurantAmenityId,
  RestaurantFilters,
  RestaurantPriceRange,
  RestaurantZoneId,
} from "@/lib/mock/restaurants";
import {
  RESTAURANT_DEFAULT_PARTY,
  RESTAURANT_FILTER_AMENITIES,
  RESTAURANT_MAX_PARTY,
  RESTAURANT_PRICE_RANGES,
  RESTAURANT_ZONES,
} from "@/lib/search/listingFilters";

type RestaurantFiltersPanelProps = {
  filters: RestaurantFilters;
  onChange: (filters: RestaurantFilters) => void;
  onReset: () => void;
  /** Skip outer GlassPanel / sticky chrome (e.g. inside a mobile Drawer). */
  embedded?: boolean;
};

export function RestaurantFiltersPanel({
  filters,
  onChange,
  onReset,
  embedded = false,
}: RestaurantFiltersPanelProps): ReactNode {
  const t = useTranslations("restaurants.filters");
  const tGov = useTranslations("landing.governorates");
  const tZones = useTranslations("restaurants.zones");
  const tAmenities = useTranslations("restaurants.amenities");

  const governorateOptions: SelectOption[] = [
    { value: "all", label: t("allGovernorates") },
    ...GOVERNORATES.map((item) => ({ value: item.slug, label: tGov(item.slug) })),
  ];
  const zoneOptions: SelectOption[] = [
    { value: "all", label: t("allZones") },
    ...RESTAURANT_ZONES.map((zone) => ({ value: zone, label: tZones(zone) })),
  ];
  const priceOptions: SelectOption[] = [
    { value: "all", label: t("allPrices") },
    ...RESTAURANT_PRICE_RANGES.map((range) => ({ value: range, label: t(`prices.${range}`) })),
  ];
  const partyOptions: SelectOption[] = Array.from({ length: RESTAURANT_MAX_PARTY }, (_, index) => ({
    value: String(index + 1),
    label: t("partyCount", { count: index + 1 }),
  }));

  function toggleAmenity(amenity: RestaurantAmenityId): void {
    const current = filters.amenities ?? [];
    const amenities = current.includes(amenity)
      ? current.filter((item) => item !== amenity)
      : [...current, amenity];
    onChange({ ...filters, amenities });
  }

  return (
    <ListingFiltersPanel
      title={t("title")}
      resetLabel={t("reset")}
      onReset={onReset}
      embedded={embedded}
    >
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
              governorate:
                value === "all" ? undefined : (value as RestaurantFilters["governorate"]),
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
              priceRange: value === "all" ? undefined : (value as RestaurantPriceRange),
            })
          }
        />
        <Select
          variant="main"
          size="sm"
          label={t("zone")}
          options={zoneOptions}
          value={filters.zone ?? "all"}
          onChange={(value) =>
            onChange({
              ...filters,
              zone: value === "all" ? undefined : (value as RestaurantZoneId),
            })
          }
        />
        <Select
          variant="main"
          size="sm"
          label={t("partySize")}
          options={partyOptions}
          value={String(filters.partySize ?? RESTAURANT_DEFAULT_PARTY)}
          onChange={(value) => onChange({ ...filters, partySize: Number(value) })}
        />
      </div>

      <fieldset className="border-border mt-5 border-t pt-5">
        <legend className="text-prose text-sm font-semibold">{t("amenities")}</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {RESTAURANT_FILTER_AMENITIES.map((amenity) => (
            <label
              key={amenity}
              className="text-prose flex cursor-pointer items-center gap-2.5 text-sm"
            >
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
