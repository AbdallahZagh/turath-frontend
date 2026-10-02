"use client";

import { Ticket } from "lucide-react";
import type { ReactNode } from "react";

import { ListingFiltersPanel } from "@/components/listings/ListingFiltersPanel";
import { DatePicker } from "@/components/ui/DatePicker";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Stepper } from "@/components/ui/Stepper";
import { useTranslations } from "@/i18n/translations";
import { GOVERNORATES } from "@/lib/mock/landing";
import type { EventFilters, EventPriceRange, EventTierId } from "@/lib/mock/events";
import { EVENT_MAX_TICKETS, EVENT_PRICE_RANGES, EVENT_TIERS } from "@/lib/search/listingFilters";

type EventFiltersPanelProps = {
  filters: EventFilters;
  onChange: (filters: EventFilters) => void;
  onReset: () => void;
  embedded?: boolean;
};

export function EventFiltersPanel({ filters, onChange, onReset, embedded = false }: EventFiltersPanelProps): ReactNode {
  const t = useTranslations("events.filters");
  const tt = useTranslations("events.tiers");
  const tGov = useTranslations("landing.governorates");
  const governorates: SelectOption[] = [{ value: "all", label: t("allGovernorates") }, ...GOVERNORATES.map((item) => ({ value: item.slug, label: tGov(item.slug) }))];
  const tiers: SelectOption[] = [{ value: "all", label: t("allTiers") }, ...EVENT_TIERS.map((tier) => ({ value: tier, label: tt(tier) }))];
  const prices: SelectOption[] = [{ value: "all", label: t("allPrices") }, ...EVENT_PRICE_RANGES.map((price) => ({ value: price, label: t(`prices.${price}`) }))];
  return (
    <ListingFiltersPanel title={t("title")} resetLabel={t("reset")} onReset={onReset} embedded={embedded}>
      <div className="space-y-4">
        <Select variant="main" size="sm" label={t("governorate")} options={governorates} value={filters.governorate ?? "all"} onChange={(value) => onChange({ ...filters, governorate: value === "all" ? undefined : value as EventFilters["governorate"] })} />
        <DatePicker variant="main" size="sm" label={t("date")} value={filters.date ?? ""} onChange={(value) => onChange({ ...filters, date: value || undefined })} />
        <Select variant="main" size="sm" label={t("tier")} options={tiers} value={filters.ticketTier ?? "all"} onChange={(value) => onChange({ ...filters, ticketTier: value === "all" ? undefined : value as EventTierId })} />
        <Select variant="main" size="sm" label={t("price")} options={prices} value={filters.priceRange ?? "all"} onChange={(value) => onChange({ ...filters, priceRange: value === "all" ? undefined : value as EventPriceRange })} />
        <Stepper variant="main" size="sm" label={t("tickets")} icon={<Ticket className="size-4" />} min={1} max={EVENT_MAX_TICKETS} value={filters.minTickets ?? 1} onChange={(value) => onChange({ ...filters, minTickets: value })} />
      </div>
    </ListingFiltersPanel>
  );
}
