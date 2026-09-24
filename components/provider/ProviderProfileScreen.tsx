"use client";

import { Inbox, ShieldLock } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ProviderProfileEditor } from "@/components/provider/ProviderProfileEditor";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useProviderProfile } from "@/hooks/useProviderProfile";
import { useAuthStore } from "@/store/authStore";

export function ProviderProfileScreen(): ReactNode {
  const t = useTranslations("provider.profile");
  const tUi = useTranslations("ui");
  const role = useAuthStore((state) => state.user.role);
  const query = useProviderProfile();

  if (role !== "PROVIDER_OWNER") {
    return <EmptyState icon={ShieldLock} title={t("ownerOnly.title")} description={t("ownerOnly.description")} />;
  }

  if (query.isPending) {
    return <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]"><div className="space-y-5"><Skeleton className="h-96" /><Skeleton className="h-96" /><Skeleton className="h-72" /></div><Skeleton className="h-[34rem]" /></div>;
  }

  if (query.isError) {
    return <ErrorState title={tUi("errorTitle")} description={tUi("errorDescription")} retryLabel={tUi("retry")} onRetry={() => void query.refetch()} />;
  }

  if (!query.data) {
    return <EmptyState icon={Inbox} title={t("empty.title")} description={t("empty.description")} />;
  }

  return <ProviderProfileEditor profile={query.data} />;
}
