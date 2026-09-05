"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Building2 } from "lucide-react";

import { AdminProviderActivity } from "@/components/admin/AdminProviderActivity";
import { AdminProviderDocuments } from "@/components/admin/AdminProviderDocuments";
import { AdminProviderFinance } from "@/components/admin/AdminProviderFinance";
import { AdminProviderInventory } from "@/components/admin/AdminProviderInventory";
import { AdminProviderProfile } from "@/components/admin/AdminProviderProfile";
import { AdminReviews } from "@/components/admin/AdminReviews";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAdminCommissions } from "@/hooks/useAdminCommissions";
import {
  useAdminProvider,
  useSetAdminProviderStatus,
} from "@/hooks/useAdminProviders";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import type { ProviderStatus } from "@/lib/mock/adminProviders";
import { reviewSummary } from "@/lib/mock/adminReviews";
import { toast } from "@/store/toastStore";

type AdminProviderDetailProps = {
  providerId: string;
};

export function AdminProviderDetail({ providerId }: AdminProviderDetailProps): ReactNode {
  const t = useTranslations("admin.providers");
  const tUi = useTranslations("ui");
  const { data, isPending, isError, refetch } = useAdminProvider(providerId);
  const { data: commissions } = useAdminCommissions();
  const { data: settings } = useAdminSettings();
  const setStatus = useSetAdminProviderStatus();

  if (isError) {
    return (
      <ErrorState
        title={tUi("errorTitle")}
        description={tUi("errorDescription")}
        retryLabel={tUi("retry")}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (isPending) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-56" />
        <Skeleton className="h-44" />
        <Skeleton className="h-64" />
        <Skeleton className="h-72" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon={Building2}
        title={t("detail.notFound")}
        description={t("detail.notFoundDescription")}
      />
    );
  }

  const { provider, ledger, activity, reviews } = data;
  const rating = reviewSummary(reviews);
  const pillarRate =
    commissions?.rows.find((row) => row.category === provider.category)?.rate ?? 0.12;
  const tierCeilingSyp = settings?.creditCeilingsSyp[provider.tier] ?? 3_000_000;

  function onStatus(status: ProviderStatus): void {
    const from = provider.status;
    setStatus.mutate(
      { id: provider.id, status },
      {
        onSuccess: () => {
          if (status === "approved" && from === "suspended") {
            toast.success(t("detail.reinstatedTitle"), t("detail.reinstatedBody"));
            return;
          }
          if (status === "approved") {
            toast.success(t("detail.approvedTitle"), t("detail.approvedBody"));
            return;
          }
          if (status === "rejected") {
            toast.warn(t("detail.rejectedTitle"), t("detail.rejectedBody"));
            return;
          }
          toast.warn(t("detail.suspendedTitle"), t("detail.suspendedBody"));
        },
        onError: () => {
          toast.error(tUi("errorTitle"), tUi("errorDescription"));
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <AdminProviderProfile
        provider={provider}
        ratingAverage={rating.average}
        ratingCount={rating.count}
        statusPending={setStatus.isPending}
        onStatus={onStatus}
      />
      <AdminProviderDocuments documents={provider.documents} />
      <AdminProviderInventory inventory={provider.inventory} status={provider.status} />
      <AdminProviderFinance
        provider={provider}
        ledger={ledger}
        pillarRate={pillarRate}
        tierCeilingSyp={tierCeilingSyp}
      />
      <AdminReviews
        title={t("detail.reviewsTitle")}
        hint={t("detail.reviewsHint")}
        empty={t("detail.reviewsEmpty")}
        reviews={reviews}
      />
      <AdminProviderActivity events={activity} />
    </div>
  );
}
