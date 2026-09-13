"use client";

import { RotateCcw, SlidersHorizontal, UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Stepper } from "@/components/ui/Stepper";
import { GOVERNORATES } from "@/lib/mock/landing";
import type { TripDurationId, TripFilters, TripPriceRange } from "@/lib/mock/trips";

const DURATIONS: TripDurationId[] = ["halfDay", "fullDay", "multiDay"];
const PRICES: TripPriceRange[] = ["under200", "200to400", "over400"];

export function TripFiltersPanel({ filters, onChange, onReset }: { filters: TripFilters; onChange: (filters: TripFilters) => void; onReset: () => void }): ReactNode {
  const t = useTranslations("trips.filters");
  const td = useTranslations("trips.durations");
  const tGov = useTranslations("landing.governorates");
  const governorates: SelectOption[] = [{ value: "all", label: t("allGovernorates") }, ...GOVERNORATES.map((item) => ({ value: item.slug, label: tGov(item.slug) }))];
  const durations: SelectOption[] = [{ value: "all", label: t("allDurations") }, ...DURATIONS.map((item) => ({ value: item, label: td(item) }))];
  const prices: SelectOption[] = [{ value: "all", label: t("allPrices") }, ...PRICES.map((item) => ({ value: item, label: t(`prices.${item}`) }))];

  return (
    <GlassPanel className="p-5 lg:sticky lg:top-28">
      <div className="flex items-center justify-between gap-3"><h2 className="text-prose flex items-center gap-2 font-semibold"><SlidersHorizontal className="text-primary size-4" aria-hidden />{t("title")}</h2><Button variant="glass" size="sm" onClick={onReset}><RotateCcw className="size-3.5" aria-hidden />{t("reset")}</Button></div>
      <div className="mt-5 space-y-4">
        <Select variant="main" label={t("governorate")} options={governorates} value={filters.governorate ?? "all"} onChange={(value) => onChange({ ...filters, governorate: value === "all" ? undefined : value as TripFilters["governorate"] })} />
        <DatePicker variant="main" label={t("date")} value={filters.date ?? ""} onChange={(value) => onChange({ ...filters, date: value || undefined })} />
        <Select variant="main" label={t("duration")} options={durations} value={filters.duration ?? "all"} onChange={(value) => onChange({ ...filters, duration: value === "all" ? undefined : value as TripDurationId })} />
        <Select variant="main" label={t("price")} options={prices} value={filters.priceRange ?? "all"} onChange={(value) => onChange({ ...filters, priceRange: value === "all" ? undefined : value as TripPriceRange })} />
        <Stepper variant="main" label={t("seats")} icon={<UsersRound className="size-4" />} min={1} max={12} value={filters.minSeats ?? 1} onChange={(value) => onChange({ ...filters, minSeats: value })} />
      </div>
    </GlassPanel>
  );
}
