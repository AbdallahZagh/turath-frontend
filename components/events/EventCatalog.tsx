"use client";

import { CalendarHeart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { EventCard } from "@/components/events/EventCard";
import { EventFiltersPanel } from "@/components/events/EventFiltersPanel";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useEvents } from "@/hooks/useEvents";
import type { EventFilters } from "@/lib/mock/events";

const DEFAULT_FILTERS: EventFilters = { minTickets: 1 };

export function EventCatalog({ initialFilters, detailBasePath = "/events" }: { initialFilters: EventFilters; detailBasePath?: string }): ReactNode {
  const t = useTranslations("events");
  const [filters, setFilters] = useState(initialFilters);
  const query = useEvents(filters);
  return <div className="grid items-start gap-7 lg:grid-cols-[18rem_minmax(0,1fr)]"><EventFiltersPanel filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} /><section aria-live="polite" className="min-w-0"><p className="text-prose-muted mb-5 text-sm">{t("resultCount", { count: query.data?.length ?? 0 })}</p>{query.isPending ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="aspect-[4/5]" />)}</div> : null}{query.isError ? <ErrorState title={t("states.errorTitle")} description={t("states.errorDescription")} retryLabel={t("states.retry")} onRetry={() => void query.refetch()} /> : null}{query.isSuccess && query.data.length === 0 ? <EmptyState icon={CalendarHeart} title={t("states.emptyTitle")} description={t("states.emptyDescription")} action={<Button variant="outline" size="sm" onClick={() => setFilters(DEFAULT_FILTERS)}>{t("states.clearFilters")}</Button>} /> : null}{query.isSuccess && query.data.length > 0 ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{query.data.map((event) => <EventCard key={event.id} event={event} detailBasePath={detailBasePath} />)}</div> : null}</section></div>;
}
