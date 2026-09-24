"use client";

import { Settings2, ShieldLock } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ProviderSettingsForm } from "@/components/provider/ProviderSettingsForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useProviderSettings } from "@/hooks/useProviderSettings";
import { useAuthStore } from "@/store/authStore";

export function ProviderSettingsScreen(): ReactNode {
  const t = useTranslations("provider.settings");
  const tUi = useTranslations("ui");
  const role = useAuthStore((state) => state.user.role);
  const query = useProviderSettings();

  if (role !== "PROVIDER_OWNER") {
    return <EmptyState icon={ShieldLock} title={t("ownerOnly.title")} description={t("ownerOnly.description")} />;
  }

  if (query.isPending) {
    return <div className="space-y-5"><Skeleton className="h-96" /><div className="grid gap-5 xl:grid-cols-2"><Skeleton className="h-64" /><Skeleton className="h-64" /></div><Skeleton className="h-64" /></div>;
  }

  if (query.isError) {
    return <ErrorState title={tUi("errorTitle")} description={tUi("errorDescription")} retryLabel={tUi("retry")} onRetry={() => void query.refetch()} />;
  }

  if (!query.data) {
    return <EmptyState icon={Settings2} title={t("empty.title")} description={t("empty.description")} />;
  }

  return <ProviderSettingsForm settings={query.data} />;
}
