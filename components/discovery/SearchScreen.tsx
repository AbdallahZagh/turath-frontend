"use client";

import { SearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { DiscoveryCard } from "@/components/discovery/DiscoveryCard";
import { DiscoveryFiltersPanel } from "@/components/discovery/DiscoveryFiltersPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDiscovery } from "@/hooks/useDiscovery";
import { useDiscoveryFilters } from "@/hooks/useDiscoveryFilters";

export function SearchScreen(): ReactNode {
  const t = useTranslations("discovery"); const discovery = useDiscoveryFilters(); const query = useDiscovery(discovery.filters);
  return <div className="grid items-start gap-7 lg:grid-cols-[20rem_minmax(0,1fr)]"><aside className="lg:sticky lg:top-28"><DiscoveryFiltersPanel discovery={discovery} mode="list" showQuery /></aside><section className="min-w-0" aria-live="polite"><p className="text-prose-muted mb-5 text-sm">{t("resultCount", { count: query.data?.length ?? 0 })}</p>{query.isPending ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="aspect-[4/5]" />)}</div> : null}{query.isError ? <ErrorState title={t("states.errorTitle")} description={t("states.errorDescription")} retryLabel={t("states.retry")} onRetry={() => void query.refetch()} /> : null}{query.isSuccess && query.data.length === 0 ? <EmptyState icon={SearchX} title={t("states.emptyTitle")} description={t("states.emptyDescription")} /> : null}{query.isSuccess && query.data.length > 0 ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{query.data.map((result) => <DiscoveryCard key={result.key} result={result} />)}</div> : null}</section></div>;
}
