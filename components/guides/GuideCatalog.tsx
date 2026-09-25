"use client";

import { RotateCcw, SlidersHorizontal, UserRoundSearch } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { GuideCard } from "@/components/guides/GuideCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { useGuides } from "@/hooks/useGuides";
import type {
  GuideDurationId,
  GuideFilters,
  GuideLanguageId,
  GuidePriceRange,
  GuideSpecialtyId,
} from "@/lib/mock/guides";
import { GOVERNORATES } from "@/lib/mock/landing";

const LANGUAGES: GuideLanguageId[] = ["arabic", "english", "french", "german"];
const SPECIALTIES: GuideSpecialtyId[] = [
  "history",
  "architecture",
  "food",
  "photography",
  "hiking",
];
const DURATIONS: GuideDurationId[] = ["hourly", "halfDay", "fullDay"];
const PRICES: GuidePriceRange[] = ["under100", "100to250", "over250"];

export function GuideCatalog({
  initialFilters,
  detailBasePath = "/guides",
}: {
  initialFilters: GuideFilters;
  detailBasePath?: string;
}): ReactNode {
  const t = useTranslations("guides");
  const tf = useTranslations("guides.filters");
  const tGov = useTranslations("landing.governorates");
  const [filters, setFilters] = useState(initialFilters);
  const query = useGuides(filters);
  const languages: SelectOption[] = [
    { value: "all", label: tf("allLanguages") },
    ...LANGUAGES.map((value) => ({ value, label: t(`languages.${value}`) })),
  ];
  const specialties: SelectOption[] = [
    { value: "all", label: tf("allSpecialties") },
    ...SPECIALTIES.map((value) => ({ value, label: t(`specialties.${value}`) })),
  ];
  const durations: SelectOption[] = [
    { value: "all", label: tf("allDurations") },
    ...DURATIONS.map((value) => ({ value, label: t(`durations.${value}`) })),
  ];
  const prices: SelectOption[] = [
    { value: "all", label: tf("allPrices") },
    ...PRICES.map((value) => ({ value, label: tf(`prices.${value}`) })),
  ];
  return (
    <div className="grid items-start gap-7 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <GlassPanel className="p-5 lg:sticky lg:top-28">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-prose flex items-center gap-2 font-semibold">
            <SlidersHorizontal className="text-primary size-4" aria-hidden />
            {tf("title")}
          </h2>
          <Button variant="glass" size="sm" onClick={() => setFilters({})}>
            <RotateCcw className="size-3.5" aria-hidden />
            {tf("reset")}
          </Button>
        </div>
        <div className="mt-5 space-y-4">
          <Select
            variant="main"
            label={tf("governorate")}
            options={[
              { value: "all", label: tf("allGovernorates") },
              ...GOVERNORATES.map((item) => ({ value: item.slug, label: tGov(item.slug) })),
            ]}
            value={filters.governorate ?? "all"}
            onChange={(value) =>
              setFilters({
                ...filters,
                governorate: value === "all" ? undefined : (value as GuideFilters["governorate"]),
              })
            }
          />
          <Select
            variant="main"
            label={tf("language")}
            options={languages}
            value={filters.language ?? "all"}
            onChange={(value) =>
              setFilters({
                ...filters,
                language: value === "all" ? undefined : (value as GuideLanguageId),
              })
            }
          />
          <Select
            variant="main"
            label={tf("specialty")}
            options={specialties}
            value={filters.specialty ?? "all"}
            onChange={(value) =>
              setFilters({
                ...filters,
                specialty: value === "all" ? undefined : (value as GuideSpecialtyId),
              })
            }
          />
          <Select
            variant="main"
            label={tf("duration")}
            options={durations}
            value={filters.duration ?? "all"}
            onChange={(value) =>
              setFilters({
                ...filters,
                duration: value === "all" ? undefined : (value as GuideDurationId),
              })
            }
          />
          <Select
            variant="main"
            label={tf("price")}
            options={prices}
            value={filters.priceRange ?? "all"}
            onChange={(value) =>
              setFilters({
                ...filters,
                priceRange: value === "all" ? undefined : (value as GuidePriceRange),
              })
            }
          />
        </div>
      </GlassPanel>
      <section aria-live="polite" className="min-w-0">
        <p className="text-prose-muted mb-5 text-sm">
          {t("resultCount", { count: query.data?.length ?? 0 })}
        </p>
        {query.isPending ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="aspect-[4/5]" />
            ))}
          </div>
        ) : null}
        {query.isError ? (
          <ErrorState
            title={t("states.errorTitle")}
            description={t("states.errorDescription")}
            retryLabel={t("states.retry")}
            onRetry={() => void query.refetch()}
          />
        ) : null}
        {query.isSuccess && query.data.length === 0 ? (
          <EmptyState
            icon={UserRoundSearch}
            title={t("states.emptyTitle")}
            description={t("states.emptyDescription")}
            action={
              <Button variant="outline" size="sm" onClick={() => setFilters({})}>
                {t("states.clearFilters")}
              </Button>
            }
          />
        ) : null}
        {query.isSuccess && query.data.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {query.data.map((guide) => (
              <GuideCard key={guide.id} guide={guide} detailBasePath={detailBasePath} />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
