"use client";

import { Landmark, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { AttractionCard } from "@/components/attractions/AttractionCard";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAttractions } from "@/hooks/useAttractions";
import { GOVERNORATES } from "@/lib/mock/landing";
import type { AttractionFilters } from "@/services/attractions";

export function AttractionCatalog({ initialFilters, detailBasePath = "/attractions" }: { initialFilters: AttractionFilters; detailBasePath?: string }): ReactNode {
  const t = useTranslations("attractions"); const tf = useTranslations("attractions.filters"); const tGov = useTranslations("landing.governorates"); const [filters, setFilters] = useState(initialFilters); const query = useAttractions(filters);
  const governorates: SelectOption[] = [{ value: "all", label: tf("allGovernorates") }, ...GOVERNORATES.map((item) => ({ value: item.slug, label: tGov(item.slug) }))];
  return <div className="grid items-start gap-7 lg:grid-cols-[18rem_minmax(0,1fr)]"><GlassPanel className="p-5 lg:sticky lg:top-28"><div className="flex items-center justify-between gap-3"><h2 className="text-prose flex items-center gap-2 font-semibold"><SlidersHorizontal className="text-primary size-4" aria-hidden />{tf("title")}</h2><Button variant="glass" size="sm" onClick={() => setFilters({})}><RotateCcw className="size-3.5" aria-hidden />{tf("reset")}</Button></div><div className="mt-5 space-y-5"><Select variant="main" label={tf("governorate")} options={governorates} value={filters.governorate ?? "all"} onChange={(value) => setFilters({ ...filters, governorate: value === "all" ? undefined : value as AttractionFilters["governorate"] })} /><label className="bg-glass-control text-prose flex cursor-pointer items-center gap-3 rounded-2xl p-4 text-sm font-semibold"><Checkbox checked={filters.openNow ?? false} onChange={(event) => setFilters({ ...filters, openNow: event.target.checked || undefined })} /><span>{tf("openNow")}</span></label></div></GlassPanel><section aria-live="polite" className="min-w-0"><p className="text-prose-muted mb-5 text-sm">{t("resultCount", { count: query.data?.length ?? 0 })}</p>{query.isPending ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="aspect-[4/5]" />)}</div> : null}{query.isError ? <ErrorState title={t("states.errorTitle")} description={t("states.errorDescription")} retryLabel={t("states.retry")} onRetry={() => void query.refetch()} /> : null}{query.isSuccess && query.data.length === 0 ? <EmptyState icon={Landmark} title={t("states.emptyTitle")} description={t("states.emptyDescription")} action={<Button variant="outline" size="sm" onClick={() => setFilters({})}>{t("states.clearFilters")}</Button>} /> : null}{query.isSuccess && query.data.length > 0 ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{query.data.map((attraction) => <AttractionCard key={attraction.id} attraction={attraction} detailBasePath={detailBasePath} />)}</div> : null}</section></div>;
}
