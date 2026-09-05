"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Download, ShieldCheck } from "lucide-react";

import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Table, type TableColumn } from "@/components/ui/Table";
import { useAdminAuditLogs } from "@/hooks/useAdminAuditLogs";
import { usePagination } from "@/hooks/usePagination";
import type { Locale } from "@/i18n/config";
import { exportToCsv } from "@/lib/export/csv";
import { formatMediumDate } from "@/lib/format/datetime";
import {
  AUDIT_MODULES,
  type AdminAuditLog,
  type AuditModule,
} from "@/lib/mock/adminAuditLogs";

const ALL = "all";

export function AdminAuditLogsPage(): ReactNode {
  const t = useTranslations("admin.auditLogs");
  const tUi = useTranslations("ui");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";

  const { data, isPending, isError, refetch } = useAdminAuditLogs();

  const [query, setQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState(ALL);

  const filtered = useMemo(() => {
    if (!data) return [];

    const needle = query.trim().toLowerCase();

    return data.filter((log) => {
      if (selectedModule !== ALL && log.module !== selectedModule) return false;
      if (!needle) return true;

      const haystack = [log.actor, log.action, log.target, log.details]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [data, selectedModule, query]);

  const paging = usePagination(filtered, `${query}|${selectedModule}`);

  function handleExportCsv(): void {
    const headers = [
      t("columns.timestamp"),
      t("columns.actor"),
      t("columns.module"),
      t("columns.action"),
      t("columns.target"),
      t("columns.details"),
    ];
    const rows = filtered.map((l) => [
      l.timestamp,
      l.actor,
      t(`modules.${l.module}`),
      l.action,
      l.target,
      l.details,
    ]);
    exportToCsv(`turath-audit-logs-${new Date().toISOString().slice(0, 10)}`, headers, rows);
  }

  const columns: TableColumn<AdminAuditLog>[] = [
    {
      id: "timestamp",
      header: t("columns.timestamp"),
      cell: (l) => (
        <span className="text-prose-muted text-xs whitespace-nowrap font-mono">
          {formatMediumDate(l.timestamp, loc)}
        </span>
      ),
    },
    {
      id: "actor",
      header: t("columns.actor"),
      cell: (l) => <span className="font-medium text-xs truncate">{l.actor}</span>,
    },
    {
      id: "module",
      header: t("columns.module"),
      cell: (l) => (
        <Badge variant="glass" className="text-[11px]">
          {t(`modules.${l.module}`)}
        </Badge>
      ),
    },
    {
      id: "action",
      header: t("columns.action"),
      cell: (l) => (
        <span className="font-mono text-xs font-semibold text-accent tracking-wide">
          {l.action}
        </span>
      ),
    },
    {
      id: "target",
      header: t("columns.target"),
      cell: (l) => <span className="font-medium text-xs text-prose truncate">{l.target}</span>,
    },
    {
      id: "details",
      header: t("columns.details"),
      cell: (l) => (
        <p className="text-prose-muted text-xs line-clamp-1 max-w-md leading-relaxed">
          {l.details}
        </p>
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
        icon={ShieldCheck}
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
            id: "module",
            label: t("columns.module"),
            value: selectedModule,
            onChange: setSelectedModule,
            options: [
              { value: ALL, label: t("allModules") },
              ...AUDIT_MODULES.map((m: AuditModule) => ({
                value: m,
                label: t(`modules.${m}`),
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
        getRowId={(l) => l.id}
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
