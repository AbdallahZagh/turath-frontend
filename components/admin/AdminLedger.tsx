"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { BookOpen, Download } from "lucide-react";

import { ADMIN_PATHS } from "@/config/adminRoutes";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { AdminNamedRating } from "@/components/admin/AdminNamedRating";
import { creditUsedClass, ledgerStandingBadgeProps } from "@/components/admin/ledgerStanding";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Table, type TableColumn } from "@/components/ui/Table";
import { useAdminLedger } from "@/hooks/useAdminLedger";
import { usePagination } from "@/hooks/usePagination";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { exportToCsv } from "@/lib/export/csv";
import { formatMediumDate } from "@/lib/format/datetime";
import { formatSyp } from "@/lib/format/money";
import { formatPercent } from "@/lib/format/number";
import { localizedName } from "@/lib/i18n/localized";
import {
  LEDGER_STANDINGS,
  outstandingSyp,
  type AdminLedgerRow,
} from "@/lib/mock/adminLedger";
import type { LandingPillarId } from "@/lib/mock/landing";

const ALL = "all";

const PILLARS: LandingPillarId[] = ["hotels", "dining", "trips", "events", "guides"];

function matchesLedgerQuery(row: AdminLedgerRow, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }

  const haystack = `${row.provider.en} ${row.provider.ar}`.toLowerCase();
  return haystack.includes(needle);
}

export function AdminLedger(): ReactNode {
  const t = useTranslations("admin.ledger");
  const tPillars = useTranslations("admin.overview.pillars");
  const tUi = useTranslations("ui");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const { data, isPending, isError, refetch } = useAdminLedger();

  const [query, setQuery] = useState("");
  const [standing, setStanding] = useState(ALL);
  const [category, setCategory] = useState(ALL);

  const filtered = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.filter((row) => {
      if (standing !== ALL && row.standing !== standing) {
        return false;
      }
      if (category !== ALL && row.category !== category) {
        return false;
      }
      return matchesLedgerQuery(row, query);
    });
  }, [data, standing, category, query]);

  const handleExportCsv = useCallback(() => {
    const headers = [
      t("columns.provider"),
      t("categoryLabel"),
      t("columns.accrued"),
      t("detail.paid"),
      t("columns.outstanding"),
      t("columns.credit"),
      t("columns.standing"),
    ];
    const rows = filtered.map((row) => [
      localizedName(row.provider, loc),
      tPillars(row.category),
      row.accruedSyp,
      row.paidSyp,
      outstandingSyp(row),
      `${Math.round(row.creditUsed * 100)}%`,
      t(`standing.${row.standing}`),
    ]);
    exportToCsv(`turath-accounts-${new Date().toISOString().slice(0, 10)}`, headers, rows);
  }, [filtered, loc, t, tPillars]);

  const paging = usePagination(filtered, `${query}|${standing}|${category}`);

  const columns: TableColumn<AdminLedgerRow>[] = [
    {
      id: "provider",
      header: t("columns.provider"),
      cell: (row) => (
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate font-medium">{localizedName(row.provider, loc)}</span>
          <span className="text-prose-muted truncate text-xs">{tPillars(row.category)}</span>
        </div>
      ),
    },
    {
      id: "rating",
      header: t("columns.rating"),
      cell: (row) => <AdminNamedRating about="provider" nameEn={row.provider.en} />,
    },
    {
      id: "outstanding",
      header: t("columns.outstanding"),
      align: "end",
      cell: (row) => (
        <span className="font-medium tabular-nums whitespace-nowrap">
          {formatSyp(outstandingSyp(row), loc)}
        </span>
      ),
    },
    {
      id: "accrued",
      header: t("columns.accrued"),
      align: "end",
      cell: (row) => (
        <span className="text-prose-muted tabular-nums whitespace-nowrap">
          {formatSyp(row.accruedSyp, loc)}
        </span>
      ),
    },
    {
      id: "credit",
      header: t("columns.credit"),
      align: "end",
      cell: (row) => (
        <div className="flex flex-col items-end gap-0.5">
          <span className={cn("font-semibold tabular-nums", creditUsedClass(row.creditUsed))}>
            {formatPercent(row.creditUsed, loc, 0)}
          </span>
          <span className="text-prose-muted text-xs tabular-nums whitespace-nowrap">
            {formatSyp(row.creditCeilingSyp, loc)}
          </span>
        </div>
      ),
    },
    {
      id: "cadence",
      header: t("columns.cadence"),
      cell: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-prose text-sm">{t(`cadence.${row.cadence}`)}</span>
          <span className="text-prose-muted whitespace-nowrap text-xs">
            {formatMediumDate(row.lastSettledAt, loc)}
          </span>
        </div>
      ),
    },
    {
      id: "standing",
      header: t("columns.standing"),
      cell: (row) => (
        <Badge {...ledgerStandingBadgeProps(row.standing)}>{t(`standing.${row.standing}`)}</Badge>
      ),
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
        icon={BookOpen}
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
            id: "standing",
            label: t("columns.standing"),
            value: standing,
            onChange: setStanding,
            options: [
              { value: ALL, label: t("allStandings") },
              ...LEDGER_STANDINGS.map((value) => ({
                value,
                label: t(`standing.${value}`),
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
        trailing={
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 shrink-0"
          >
            <Download className="size-3.5" aria-hidden />
            <span>{tUi("exportCsv")}</span>
          </Button>
        }
      />

      <Table
        fill
        columns={columns}
        rows={paging.rows}
        getRowId={(row) => row.id}
        getRowHref={(row) => ADMIN_PATHS.account(row.id)}
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
