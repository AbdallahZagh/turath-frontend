"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Download, Users } from "lucide-react";

import { ADMIN_PATHS } from "@/config/adminRoutes";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { AdminNamedRating } from "@/components/admin/AdminNamedRating";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Table, type TableColumn } from "@/components/ui/Table";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { usePagination } from "@/hooks/usePagination";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { exportToCsv } from "@/lib/export/csv";
import { formatMediumDate } from "@/lib/format/datetime";
import { formatCount, formatReliabilityScore } from "@/lib/format/number";
import { localizedName } from "@/lib/i18n/localized";
import {
  DEFAULT_RELIABILITY_CUTOFFS,
  reliabilityTier,
  reliabilityTierClass,
  type AdminUser,
} from "@/lib/mock/adminUsers";

const ALL = "all";

function matchesUserQuery(user: AdminUser, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }

  const haystack = [user.name.en, user.name.ar, user.phone, user.email]
    .join(" ")
    .toLowerCase();

  return haystack.includes(needle);
}

export function AdminUsers(): ReactNode {
  const t = useTranslations("admin.users");
  const tUi = useTranslations("ui");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const { data, isPending, isError, refetch } = useAdminUsers();
  const { data: settings } = useAdminSettings();
  const cutoffs = settings
    ? {
        vipAtOrAbove: settings.reliability.vipAtOrAbove,
        standardAtOrAbove: settings.reliability.standardAtOrAbove,
        restrictedAtOrAbove: settings.reliability.restrictedAtOrAbove,
      }
    : DEFAULT_RELIABILITY_CUTOFFS;
  const [query, setQuery] = useState("");
  const [account, setAccount] = useState(ALL);
  const [reliability, setReliability] = useState(ALL);

  const filtered = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.filter((user) => {
      if (account === "locked" && !user.locked) {
        return false;
      }
      if (account === "active" && user.locked) {
        return false;
      }
      if (
        reliability !== ALL &&
        reliabilityTier(user.reliability, cutoffs) !== reliability
      ) {
        return false;
      }
      return matchesUserQuery(user, query);
    });
  }, [data, query, account, reliability, cutoffs]);

  const handleExportCsv = useCallback(() => {
    const headers = [
      t("columns.name"),
      t("columns.phone"),
      t("detail.email"),
      t("columns.joined"),
      t("columns.bookings"),
      t("columns.reliability"),
      t("accountLabel"),
    ];
    const rows = filtered.map((user) => [
      localizedName(user.name, loc),
      user.phone,
      user.email,
      formatMediumDate(user.joinedAt, loc),
      user.completedBookings,
      formatReliabilityScore(user.reliability, loc),
      user.locked ? t("account.locked") : t("account.active"),
    ]);
    exportToCsv(`turath-guests-${new Date().toISOString().slice(0, 10)}`, headers, rows);
  }, [filtered, loc, t]);

  const paging = usePagination(filtered, `${query}|${account}|${reliability}`);

  const columns: TableColumn<AdminUser>[] = [
    {
      id: "name",
      header: t("columns.name"),
      cell: (user) => (
        <div className="flex min-w-0 flex-col gap-1">
          <span className="flex items-center gap-2 font-medium">
            <span className="truncate">{localizedName(user.name, loc)}</span>
            {user.locked ? (
              <Badge variant="outline" className="text-destructive border-destructive">
                {t("locked")}
              </Badge>
            ) : null}
          </span>
          <span className="text-prose-muted truncate text-xs">{user.email}</span>
        </div>
      ),
    },
    {
      id: "phone",
      header: t("columns.phone"),
      cell: (user) => (
        <span className="tabular-nums whitespace-nowrap">{user.phone}</span>
      ),
    },
    {
      id: "rating",
      header: t("columns.rating"),
      cell: (user) => <AdminNamedRating about="guest" nameEn={user.name.en} />,
    },
    {
      id: "reliability",
      header: t("columns.reliability"),
      align: "end",
      cell: (user) => (
        <span
          className={cn(
            "font-semibold tabular-nums",
            reliabilityTierClass(reliabilityTier(user.reliability, cutoffs)),
          )}
        >
          {formatReliabilityScore(user.reliability, loc)}
        </span>
      ),
    },
    {
      id: "bookings",
      header: t("columns.bookings"),
      align: "end",
      cell: (user) => (
        <span className="tabular-nums">{formatCount(user.completedBookings, loc)}</span>
      ),
    },
    {
      id: "joined",
      header: t("columns.joined"),
      cell: (user) => (
        <span className="text-prose-muted whitespace-nowrap">
          {formatMediumDate(user.joinedAt, loc)}
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
        icon={Users}
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
            id: "account",
            label: t("accountLabel"),
            value: account,
            onChange: setAccount,
            options: [
              { value: ALL, label: t("allAccounts") },
              { value: "active", label: t("account.active") },
              { value: "locked", label: t("account.locked") },
            ],
          },
          {
            id: "reliability",
            label: t("columns.reliability"),
            value: reliability,
            onChange: setReliability,
            options: [
              { value: ALL, label: t("allReliability") },
              { value: "vip", label: t("reliabilityTier.vip") },
              { value: "standard", label: t("reliabilityTier.standard") },
              { value: "restricted", label: t("reliabilityTier.restricted") },
              { value: "suspended", label: t("reliabilityTier.suspended") },
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
        getRowId={(user) => user.id}
        getRowHref={(user) => ADMIN_PATHS.guest(user.id)}
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
