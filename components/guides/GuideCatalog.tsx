"use client";

import { UserRoundSearch } from "lucide-react";
import type { ReactNode } from "react";

import { GuideCard } from "@/components/guides/GuideCard";
import { GuideFiltersPanel } from "@/components/guides/GuideFiltersPanel";
import { ListingFiltersLayout } from "@/components/listings/ListingFiltersLayout";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import type { FilterChip } from "@/components/ui/FilterChips";
import { Skeleton } from "@/components/ui/Skeleton";
import { useGuides } from "@/hooks/useGuides";
import { useGuideFilters } from "@/hooks/useListingFilters";
import { useTranslations } from "@/i18n/translations";
import type { GuideFilters } from "@/lib/mock/guides";

export function GuideCatalog({ detailBasePath = "/guides" }: { detailBasePath?: string }): ReactNode {
  const t = useTranslations("guides");
  const tf = useTranslations("guides.filters");
  const tGov = useTranslations("landing.governorates");
  const { filters, setFilters, reset } = useGuideFilters();
  const query = useGuides(filters);

  function patch(next: Partial<GuideFilters>): () => void {
    return () => setFilters({ ...filters, ...next });
  }

  const chips: FilterChip[] = [];
  if (filters.governorate) chips.push({ id: "governorate", label: tf("governorate"), value: tGov(filters.governorate), onRemove: patch({ governorate: undefined }) });
  if (filters.language) chips.push({ id: "language", label: tf("language"), value: t(`languages.${filters.language}`), onRemove: patch({ language: undefined }) });
  if (filters.specialty) chips.push({ id: "specialty", label: tf("specialty"), value: t(`specialties.${filters.specialty}`), onRemove: patch({ specialty: undefined }) });
  if (filters.duration) chips.push({ id: "duration", label: tf("duration"), value: t(`durations.${filters.duration}`), onRemove: patch({ duration: undefined }) });
  if (filters.priceRange) chips.push({ id: "priceRange", label: tf("price"), value: tf(`prices.${filters.priceRange}`), onRemove: patch({ priceRange: undefined }) });

  return (
    <ListingFiltersLayout
      renderFilters={(embedded) => <GuideFiltersPanel embedded={embedded} filters={filters} onChange={setFilters} onReset={reset} />}
      drawerTitle={tf("title")}
      resetLabel={tf("reset")}
      showResultsLabel={tf("showResults")}
      onReset={reset}
      chips={chips}
      summary={
        <p className="text-prose-muted text-sm">
          {t("resultCount", { count: query.data?.length ?? 0 })}
        </p>
      }
    >
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
            <Button variant="outline" size="sm" onClick={reset}>
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
    </ListingFiltersLayout>
  );
}
