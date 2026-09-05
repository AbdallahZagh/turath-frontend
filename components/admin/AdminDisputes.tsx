"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Scale } from "lucide-react";

import { ADMIN_PATHS } from "@/config/adminRoutes";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { disputeStatusBadgeProps } from "@/components/admin/disputeStatus";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Table, type TableColumn } from "@/components/ui/Table";
import { useAdminDisputes } from "@/hooks/useAdminDisputes";
import { usePagination } from "@/hooks/usePagination";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import { formatSyp } from "@/lib/format/money";
import { localizedName } from "@/lib/i18n/localized";
import {
  DISPUTE_STATUSES,
  type AdminDispute,
} from "@/lib/mock/adminDisputes";
import type { LandingPillarId } from "@/lib/mock/landing";

const ALL = "all";

const PILLARS: LandingPillarId[] = ["hotels", "dining", "trips", "events", "guides"];

function matchesDisputeQuery(dispute: AdminDispute, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }

  const haystack = [
    dispute.guest.en,
    dispute.guest.ar,
    dispute.provider.en,
    dispute.provider.ar,
    dispute.bookingCode,
    dispute.providerClaim.en,
    dispute.providerClaim.ar,
    dispute.touristClaim.en,
    dispute.touristClaim.ar,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(needle);
}

export function AdminDisputes(): ReactNode {
  const t = useTranslations("admin.disputes");
  const tPillars = useTranslations("admin.overview.pillars");
  const tUi = useTranslations("ui");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const { data, isPending, isError, refetch } = useAdminDisputes();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(ALL);
  const [category, setCategory] = useState(ALL);

  const filtered = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.filter((dispute) => {
      if (status !== ALL && dispute.status !== status) {
        return false;
      }
      if (category !== ALL && dispute.category !== category) {
        return false;
      }
      return matchesDisputeQuery(dispute, query);
    });
  }, [data, status, category, query]);

  const paging = usePagination(filtered, `${query}|${status}|${category}`);

  const columns: TableColumn<AdminDispute>[] = [
    {
      id: "case",
      header: t("columns.case"),
      cell: (dispute) => (
        <div className="flex min-w-0 flex-col gap-1">
          <span className="font-medium tracking-wider tabular-nums">{dispute.bookingCode}</span>
          <span className="text-prose-muted whitespace-nowrap text-xs">
            {formatMediumDate(dispute.openedAt, loc)}
          </span>
        </div>
      ),
    },
    {
      id: "parties",
      header: t("columns.parties"),
      cell: (dispute) => (
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate font-medium">{localizedName(dispute.guest, loc)}</span>
          <span className="text-prose-muted truncate text-xs">
            {localizedName(dispute.provider, loc)} · {tPillars(dispute.category)}
          </span>
        </div>
      ),
    },
    {
      id: "claims",
      header: t("columns.claims"),
      cell: (dispute) => (
        <div className="flex max-w-sm flex-col gap-1.5">
          <p className="text-prose text-xs leading-relaxed">
            <span className="text-prose-muted font-semibold">{t("providerLabel")}: </span>
            {localizedName(dispute.providerClaim, loc)}
          </p>
          <p className="text-prose text-xs leading-relaxed">
            <span className="text-prose-muted font-semibold">{t("touristLabel")}: </span>
            {localizedName(dispute.touristClaim, loc)}
          </p>
        </div>
      ),
    },
    {
      id: "amount",
      header: t("columns.amount"),
      align: "end",
      cell: (dispute) => (
        <span className="font-medium tabular-nums whitespace-nowrap">
          {formatSyp(dispute.amountSyp, loc)}
        </span>
      ),
    },
    {
      id: "status",
      header: t("columns.status"),
      cell: (dispute) => (
        <Badge {...disputeStatusBadgeProps(dispute.status)}>{t(`status.${dispute.status}`)}</Badge>
      ),
    },
    {
      id: "notes",
      header: t("columns.notes"),
      cell: (dispute) => {
        const notes = localizedName(dispute.notes, loc);
        return (
          <span className="text-prose-muted max-w-56 truncate text-xs">
            {notes || t("noNotes")}
          </span>
        );
      },
    },
  ];

  if (isError) {
    return (
      <ErrorState
        className="flex-1 justify-center"
        title={tUi("errorTitle")}
        description={tUi("errorDescription")}
        retryLabel={tUi("retry")}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (!isPending && data && data.length === 0) {
    return (
      <EmptyState
        className="flex-1 justify-center"
        icon={Scale}
        title={tUi("emptyTitle")}
        description={t("empty")}
      />
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <AdminFilterBar
        search={query}
        onSearchChange={setQuery}
        searchPlaceholder={t("searchPlaceholder")}
        filters={[
          {
            id: "status",
            label: t("columns.status"),
            value: status,
            onChange: setStatus,
            options: [
              { value: ALL, label: t("allStatuses") },
              ...DISPUTE_STATUSES.map((value) => ({
                value,
                label: t(`status.${value}`),
              })),
            ],
          },
          {
            id: "category",
            label: t("categoryLabel"),
            value: category,
            onChange: setCategory,
            options: [
              { value: ALL, label: t("allCategories") },
              ...PILLARS.map((id) => ({ value: id, label: tPillars(id) })),
            ],
          },
        ]}
      />

      <Table
        fill
        columns={columns}
        rows={paging.rows}
        getRowId={(dispute) => dispute.id}
        getRowHref={(dispute) => ADMIN_PATHS.noShow(dispute.id)}
        caption={t("caption")}
        emptyMessage={t("emptyFiltered")}
        isLoading={isPending}
        loadingRowCount={paging.pageSize}
        pagination={
          isPending
            ? undefined
            : {
                page: paging.page,
                pageCount: paging.pageCount,
                pageSize: paging.pageSize,
                total: paging.total,
                onPageChange: paging.setPage,
                onPageSizeChange: paging.setPageSize,
              }
        }
      />
    </div>
  );
}
