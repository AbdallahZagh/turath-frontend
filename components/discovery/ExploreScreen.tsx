"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { DiscoveryFiltersPanel } from "@/components/discovery/DiscoveryFiltersPanel";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDiscovery } from "@/hooks/useDiscovery";
import { useDiscoveryFilters } from "@/hooks/useDiscoveryFilters";

const ExploreMap = dynamic(() => import("@/components/discovery/ExploreMap").then((module) => module.ExploreMap), { ssr: false, loading: () => <Skeleton className="h-full min-h-[36rem]" /> });

export function ExploreScreen(): ReactNode {
  const t = useTranslations("discovery"); const discovery = useDiscoveryFilters(); const query = useDiscovery(discovery.filters);
  return <div className="grid min-h-[calc(100svh-10rem)] gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]"><aside className="lg:max-h-[calc(100svh-8rem)] lg:overflow-y-auto"><DiscoveryFiltersPanel discovery={discovery} mode="map" /></aside><section className="min-w-0">{query.isPending ? <Skeleton className="h-full min-h-[36rem]" /> : null}{query.isError ? <ErrorState title={t("states.errorTitle")} description={t("states.errorDescription")} retryLabel={t("states.retry")} onRetry={() => void query.refetch()} /> : null}{query.isSuccess ? <ExploreMap results={query.data} /> : null}</section></div>;
}
