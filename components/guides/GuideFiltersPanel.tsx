"use client";

import type { ReactNode } from "react";

import { ListingFiltersPanel } from "@/components/listings/ListingFiltersPanel";
import { Select, type SelectOption } from "@/components/ui/Select";
import { useTranslations } from "@/i18n/translations";
import type {
  GuideDurationId,
  GuideFilters,
  GuideLanguageId,
  GuidePriceRange,
  GuideSpecialtyId,
} from "@/lib/mock/guides";
import { GOVERNORATES } from "@/lib/mock/landing";
import {
  GUIDE_DURATIONS,
  GUIDE_LANGUAGES,
  GUIDE_PRICE_RANGES,
  GUIDE_SPECIALTIES,
} from "@/lib/search/listingFilters";

type GuideFiltersPanelProps = {
  filters: GuideFilters;
  onChange: (filters: GuideFilters) => void;
  onReset: () => void;
  embedded?: boolean;
};

export function GuideFiltersPanel({ filters, onChange, onReset, embedded = false }: GuideFiltersPanelProps): ReactNode {
  const t = useTranslations("guides");
  const tf = useTranslations("guides.filters");
  const tGov = useTranslations("landing.governorates");
  const governorates: SelectOption[] = [
    { value: "all", label: tf("allGovernorates") },
    ...GOVERNORATES.map((item) => ({ value: item.slug, label: tGov(item.slug) })),
  ];
  const languages: SelectOption[] = [
    { value: "all", label: tf("allLanguages") },
    ...GUIDE_LANGUAGES.map((value) => ({ value, label: t(`languages.${value}`) })),
  ];
  const specialties: SelectOption[] = [
    { value: "all", label: tf("allSpecialties") },
    ...GUIDE_SPECIALTIES.map((value) => ({ value, label: t(`specialties.${value}`) })),
  ];
  const durations: SelectOption[] = [
    { value: "all", label: tf("allDurations") },
    ...GUIDE_DURATIONS.map((value) => ({ value, label: t(`durations.${value}`) })),
  ];
  const prices: SelectOption[] = [
    { value: "all", label: tf("allPrices") },
    ...GUIDE_PRICE_RANGES.map((value) => ({ value, label: tf(`prices.${value}`) })),
  ];

  return (
    <ListingFiltersPanel title={tf("title")} resetLabel={tf("reset")} onReset={onReset} embedded={embedded}>
      <div className="space-y-4">
        <Select
          variant="main"
          size="sm"
          label={tf("governorate")}
          options={governorates}
          value={filters.governorate ?? "all"}
          onChange={(value) =>
            onChange({
              ...filters,
              governorate: value === "all" ? undefined : (value as GuideFilters["governorate"]),
            })
          }
        />
        <Select
          variant="main"
          size="sm"
          label={tf("language")}
          options={languages}
          value={filters.language ?? "all"}
          onChange={(value) =>
            onChange({ ...filters, language: value === "all" ? undefined : (value as GuideLanguageId) })
          }
        />
        <Select
          variant="main"
          size="sm"
          label={tf("specialty")}
          options={specialties}
          value={filters.specialty ?? "all"}
          onChange={(value) =>
            onChange({ ...filters, specialty: value === "all" ? undefined : (value as GuideSpecialtyId) })
          }
        />
        <Select
          variant="main"
          size="sm"
          label={tf("duration")}
          options={durations}
          value={filters.duration ?? "all"}
          onChange={(value) =>
            onChange({ ...filters, duration: value === "all" ? undefined : (value as GuideDurationId) })
          }
        />
        <Select
          variant="main"
          size="sm"
          label={tf("price")}
          options={prices}
          value={filters.priceRange ?? "all"}
          onChange={(value) =>
            onChange({ ...filters, priceRange: value === "all" ? undefined : (value as GuidePriceRange) })
          }
        />
      </div>
    </ListingFiltersPanel>
  );
}
