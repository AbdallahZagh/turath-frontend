"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Select, type SelectOption } from "@/components/ui/Select";
import { GOVERNORATES } from "@/lib/mock/landing";
import type { RestaurantAmenityId, RestaurantFilters, RestaurantPriceRange, RestaurantZoneId } from "@/lib/mock/restaurants";

const ZONES: RestaurantZoneId[] = ["indoor", "terrace", "vip", "smoking"];
const PRICES: RestaurantPriceRange[] = ["under75", "75to150", "over150"];
const AMENITIES: RestaurantAmenityId[] = ["generator", "wifi", "ac", "accessible"];

type Props = { filters: RestaurantFilters; onChange: (filters: RestaurantFilters) => void; onReset: () => void };

export function RestaurantFiltersPanel({ filters, onChange, onReset }: Props): ReactNode {
  const t = useTranslations("restaurants.filters");
  const tGov = useTranslations("landing.governorates");
  const tZones = useTranslations("restaurants.zones");
  const tAmenities = useTranslations("restaurants.amenities");
  const governorates: SelectOption[] = [{ value: "all", label: t("allGovernorates") }, ...GOVERNORATES.map((item) => ({ value: item.slug, label: tGov(item.slug) }))];
  const zones: SelectOption[] = [{ value: "all", label: t("allZones") }, ...ZONES.map((zone) => ({ value: zone, label: tZones(zone) }))];
  const prices: SelectOption[] = [{ value: "all", label: t("allPrices") }, ...PRICES.map((price) => ({ value: price, label: t(`prices.${price}`) }))];
  const parties: SelectOption[] = Array.from({ length: 12 }, (_, index) => ({ value: String(index + 1), label: t("partyCount", { count: index + 1 }) }));

  function toggleAmenity(amenity: RestaurantAmenityId): void {
    const current = filters.amenities ?? [];
    onChange({ ...filters, amenities: current.includes(amenity) ? current.filter((item) => item !== amenity) : [...current, amenity] });
  }

  return (
    <GlassPanel className="p-5 lg:sticky lg:top-28">
      <div className="flex items-center justify-between gap-3"><h2 className="font-heading text-prose flex items-center gap-2 text-lg font-semibold"><SlidersHorizontal className="text-accent size-5" aria-hidden />{t("title")}</h2><Button variant="glass" size="sm" onClick={onReset}><RotateCcw className="size-3.5" aria-hidden />{t("reset")}</Button></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <Select variant="main" size="sm" label={t("governorate")} options={governorates} value={filters.governorate ?? "all"} onChange={(value) => onChange({ ...filters, governorate: value === "all" ? undefined : value as RestaurantFilters["governorate"] })} />
        <Select variant="main" size="sm" label={t("price")} options={prices} value={filters.priceRange ?? "all"} onChange={(value) => onChange({ ...filters, priceRange: value === "all" ? undefined : value as RestaurantPriceRange })} />
        <Select variant="main" size="sm" label={t("zone")} options={zones} value={filters.zone ?? "all"} onChange={(value) => onChange({ ...filters, zone: value === "all" ? undefined : value as RestaurantZoneId })} />
        <Select variant="main" size="sm" label={t("partySize")} options={parties} value={String(filters.partySize ?? 2)} onChange={(value) => onChange({ ...filters, partySize: Number(value) })} />
      </div>
      <fieldset className="border-border mt-5 border-t pt-5"><legend className="text-prose text-sm font-semibold">{t("amenities")}</legend><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">{AMENITIES.map((amenity) => <label key={amenity} className="text-prose flex cursor-pointer items-center gap-2.5 text-sm"><Checkbox size="sm" checked={(filters.amenities ?? []).includes(amenity)} onChange={() => toggleAmenity(amenity)} />{tAmenities(amenity)}</label>)}</div></fieldset>
    </GlassPanel>
  );
}
