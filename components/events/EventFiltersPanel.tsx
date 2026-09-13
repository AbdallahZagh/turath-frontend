"use client";

import { RotateCcw, SlidersHorizontal, Ticket } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Stepper } from "@/components/ui/Stepper";
import { GOVERNORATES } from "@/lib/mock/landing";
import type { EventFilters, EventPriceRange, EventTierId } from "@/lib/mock/events";

const TIERS: EventTierId[] = ["standard", "vip"];
const PRICES: EventPriceRange[] = ["under100", "100to250", "over250"];

export function EventFiltersPanel({ filters, onChange, onReset }: { filters: EventFilters; onChange: (filters: EventFilters) => void; onReset: () => void }): ReactNode {
  const t = useTranslations("events.filters");
  const tt = useTranslations("events.tiers");
  const tGov = useTranslations("landing.governorates");
  const governorates: SelectOption[] = [{ value: "all", label: t("allGovernorates") }, ...GOVERNORATES.map((item) => ({ value: item.slug, label: tGov(item.slug) }))];
  const tiers: SelectOption[] = [{ value: "all", label: t("allTiers") }, ...TIERS.map((tier) => ({ value: tier, label: tt(tier) }))];
  const prices: SelectOption[] = [{ value: "all", label: t("allPrices") }, ...PRICES.map((price) => ({ value: price, label: t(`prices.${price}`) }))];
  return <GlassPanel className="p-5 lg:sticky lg:top-28"><div className="flex items-center justify-between gap-3"><h2 className="text-prose flex items-center gap-2 font-semibold"><SlidersHorizontal className="text-primary size-4" aria-hidden />{t("title")}</h2><Button variant="glass" size="sm" onClick={onReset}><RotateCcw className="size-3.5" aria-hidden />{t("reset")}</Button></div><div className="mt-5 space-y-4">
    <Select variant="main" label={t("governorate")} options={governorates} value={filters.governorate ?? "all"} onChange={(value) => onChange({ ...filters, governorate: value === "all" ? undefined : value as EventFilters["governorate"] })} />
    <DatePicker variant="main" label={t("date")} value={filters.date ?? ""} onChange={(value) => onChange({ ...filters, date: value || undefined })} />
    <Select variant="main" label={t("tier")} options={tiers} value={filters.ticketTier ?? "all"} onChange={(value) => onChange({ ...filters, ticketTier: value === "all" ? undefined : value as EventTierId })} />
    <Select variant="main" label={t("price")} options={prices} value={filters.priceRange ?? "all"} onChange={(value) => onChange({ ...filters, priceRange: value === "all" ? undefined : value as EventPriceRange })} />
    <Stepper variant="main" label={t("tickets")} icon={<Ticket className="size-4" />} min={1} max={6} value={filters.minTickets ?? 1} onChange={(value) => onChange({ ...filters, minTickets: value })} />
  </div></GlassPanel>;
}
