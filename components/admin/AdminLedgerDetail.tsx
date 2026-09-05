"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { BookOpen } from "lucide-react";

import { AdminLedgerAccount } from "@/components/admin/AdminLedgerAccount";
import { AdminLedgerBalance } from "@/components/admin/AdminLedgerBalance";
import { AdminLedgerStatements } from "@/components/admin/AdminLedgerStatements";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  useAdminLedgerDetail,
  useRecordAdminLedgerSettlement,
  useSetAdminLedgerStanding,
} from "@/hooks/useAdminLedger";
import { toast } from "@/store/toastStore";

type AdminLedgerDetailProps = {
  ledgerId: string;
};

export function AdminLedgerDetail({ ledgerId }: AdminLedgerDetailProps): ReactNode {
  const t = useTranslations("admin.ledger");
  const tUi = useTranslations("ui");
  const { data, isPending, isError, refetch } = useAdminLedgerDetail(ledgerId);
  const setStanding = useSetAdminLedgerStanding();
  const recordSettlement = useRecordAdminLedgerSettlement();

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
        <Skeleton className="h-52" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-40" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon={BookOpen}
        title={t("detail.notFound")}
        description={t("detail.notFoundDescription")}
      />
    );
  }

  const { ledger, statements, providerId } = data;
  const actionPending = setStanding.isPending || recordSettlement.isPending;

  function onSuspend(): void {
    setStanding.mutate(
      { id: ledger.id, standing: "suspended" },
      {
        onSuccess: () => {
          toast.warn(t("detail.suspendedTitle"), t("detail.suspendedBody"));
        },
        onError: () => {
          toast.error(tUi("errorTitle"), tUi("errorDescription"));
        },
      },
    );
  }

  function onReinstate(): void {
    setStanding.mutate(
      { id: ledger.id, standing: "reinstate" },
      {
        onSuccess: () => {
          toast.success(t("detail.reinstatedTitle"), t("detail.reinstatedBody"));
        },
        onError: () => {
          toast.error(tUi("errorTitle"), tUi("errorDescription"));
        },
      },
    );
  }

  function onRecordSettlement(): void {
    recordSettlement.mutate(ledger.id, {
      onSuccess: () => {
        toast.success(t("detail.settledTitle"), t("detail.settledBody"));
      },
      onError: () => {
        toast.error(tUi("errorTitle"), tUi("errorDescription"));
      },
    });
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <AdminLedgerAccount
        ledger={ledger}
        providerId={providerId}
        actionPending={actionPending}
        onSuspend={onSuspend}
        onReinstate={onReinstate}
        onRecordSettlement={onRecordSettlement}
      />
      <AdminLedgerBalance ledger={ledger} />
      <AdminLedgerStatements statements={statements} />
    </div>
  );
}
