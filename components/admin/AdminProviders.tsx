"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Building2, Download } from "lucide-react";

import { ADMIN_PATHS } from "@/config/adminRoutes";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { AdminNamedRating } from "@/components/admin/AdminNamedRating";
import { providerStatusBadgeProps } from "@/components/admin/providerStatus";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Table, type TableColumn } from "@/components/ui/Table";
import { useAdminProviders } from "@/hooks/useAdminProviders";
import { usePagination } from "@/hooks/usePagination";
import type { Locale } from "@/i18n/config";
import { exportToCsv } from "@/lib/export/csv";
import { formatMediumDate } from "@/lib/format/datetime";
import { localizedName } from "@/lib/i18n/localized";
import {
  PROVIDER_STATUSES,
  type AdminProvider,
} from "@/lib/mock/adminProviders";
import { GOVERNORATES, type LandingPillarId } from "@/lib/mock/landing";

const ALL = "all";

const PILLARS: LandingPillarId[] = ["hotels", "dining", "trips", "events", "guides"];

function matchesProviderQuery(provider: AdminProvider, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }

  const haystack = [
    provider.name.en,
    provider.name.ar,
    provider.owner.en,
    provider.owner.ar,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(needle);
}

export function AdminProviders(): ReactNode {
  const t = useTranslations("admin.providers");
  const tPillars = useTranslations("admin.overview.pillars");
  const tGov = useTranslations("landing.governorates");
  const tUi = useTranslations("ui");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const { data, isPending, isError, refetch } = useAdminProviders();

  const [status, setStatus] = useState(ALL);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [governorate, setGovernorate] = useState(ALL);

  const rows = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.filter((provider) => {
      if (status !== ALL && provider.status !== status) {
        return false;
      }
      if (category !== ALL && provider.category !== category) {
        return false;
      }
      if (governorate !== ALL && provider.governorate !== governorate) {
        return false;
      }
      return matchesProviderQuery(provider, query);
    });
  }, [data, status, category, governorate, query]);

  const handleExportCsv = useCallback(() => {
    const headers = [
      t("columns.business"),
      t("detail.owner"),
      t("columns.category"),
      t("columns.governorate"),
      t("columns.status"),
      t("columns.submitted"),
    ];
    const exportRows = rows.map((provider) => [
      localizedName(provider.name, loc),
      localizedName(provider.owner, loc),
      tPillars(provider.category),
      tGov(provider.governorate),
      t(`status.${provider.status}`),
      formatMediumDate(provider.submittedAt, loc),
    ]);
    exportToCsv(`turath-businesses-${new Date().toISOString().slice(0, 10)}`, headers, exportRows);
  }, [rows, loc, t, tPillars, tGov]);

  const filterKey = `${status}|${query}|${category}|${governorate}`;
  const paging = usePagination(rows, filterKey);

  const columns: TableColumn<AdminProvider>[] = [
    {
      id: "business",
      header: t("columns.business"),
      cell: (provider) => (
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate font-medium">{localizedName(provider.name, loc)}</span>
          <span className="text-prose-muted truncate text-xs">
            {localizedName(provider.owner, loc)}
          </span>
        </div>
      ),
    },
    {
      id: "category",
      header: t("columns.category"),
      cell: (provider) => tPillars(provider.category),
    },
    {
      id: "governorate",
      header: t("columns.governorate"),
      cell: (provider) => tGov(provider.governorate),
    },
    {
      id: "rating",
      header: t("columns.rating"),
      cell: (provider) => (
        <AdminNamedRating about="provider" nameEn={provider.name.en} />
      ),
    },
    {
      id: "status",
      header: t("columns.status"),
      cell: (provider) => (
        <Badge {...providerStatusBadgeProps(provider.status)}>
          {t(`status.${provider.status}`)}
        </Badge>
      ),
    },
    {
      id: "submitted",
      header: t("columns.submitted"),
      cell: (provider) => (
        <span className="text-prose-muted whitespace-nowrap">
          {formatMediumDate(provider.submittedAt, loc)}
        </span>
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
        icon={Building2}
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
              ...PROVIDER_STATUSES.map((value) => ({
                value,
                label: t(`status.${value}`),
              })),
            ],
          },
          {
            id: "category",
            label: t("columns.category"),
            value: category,
            onChange: setCategory,
            options: [
              { value: ALL, label: t("allCategories") },
              ...PILLARS.map((id) => ({ value: id, label: tPillars(id) })),
            ],
          },
          {
            id: "governorate",
            label: t("columns.governorate"),
            value: governorate,
            onChange: setGovernorate,
            options: [
              { value: ALL, label: t("allGovernorates") },
              ...GOVERNORATES.map((item) => ({
                value: item.slug,
                label: tGov(item.slug),
              })),
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
        getRowId={(provider) => provider.id}
        getRowHref={(provider) => ADMIN_PATHS.business(provider.id)}
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
