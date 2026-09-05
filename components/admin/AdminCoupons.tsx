"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { TicketPercent } from "lucide-react";

import { AdminCouponDeleteDialog } from "@/components/admin/AdminCouponDeleteDialog";
import { AdminCouponModal } from "@/components/admin/AdminCouponModal";
import { AdminEditDeleteMenu } from "@/components/admin/AdminEditDeleteMenu";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { stopMenuEvent } from "@/components/ui/Menu";
import { Table, type TableColumn } from "@/components/ui/Table";
import { useAdminCoupons } from "@/hooks/useAdminCoupons";
import { usePageHeaderAction } from "@/hooks/usePageHeaderAction";
import { usePagination } from "@/hooks/usePagination";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import { formatSyp } from "@/lib/format/money";
import { localizedName, type LocalizedName } from "@/lib/i18n/localized";
import type { LandingPillarId } from "@/lib/mock/landing";
import {
  COUPON_SCOPES,
  COUPON_STATUSES,
  couponProviderOptions,
  couponStatus,
  isLandingPillarId,
  listCouponListings,
  type AdminCoupon,
  type CouponScope,
  type CouponStatus,
} from "@/lib/mock/adminCoupons";

const ALL = "all";

function couponScopeLabel(
  row: AdminCoupon,
  loc: Locale,
  tScope: (scope: CouponScope) => string,
  tPillar: (id: LandingPillarId) => string,
  providers: { id: string; name: LocalizedName }[],
  listings: { id: string; name: LocalizedName }[],
): string {
  if (row.scope === "platform") {
    return tScope("platform");
  }
  if (row.scope === "pillar" && row.scopeId && isLandingPillarId(row.scopeId)) {
    return tPillar(row.scopeId);
  }
  if (row.scope === "provider" && row.scopeId) {
    const provider = providers.find((item) => item.id === row.scopeId);
    if (provider) {
      return localizedName(provider.name, loc);
    }
  }
  if (row.scope === "listing" && row.scopeId) {
    const listing = listings.find((item) => item.id === row.scopeId);
    if (listing) {
      return localizedName(listing.name, loc);
    }
  }
  return tScope(row.scope);
}

function statusBadgeProps(status: CouponStatus): {
  variant: BadgeVariant;
  className?: string;
} {
  if (status === "live") {
    return { variant: "solid" };
  }
  if (status === "scheduled") {
    return { variant: "glass", className: "text-accent" };
  }
  if (status === "disabled") {
    return { variant: "outline", className: "text-prose-muted" };
  }
  return { variant: "outline" };
}

export function AdminCoupons(): ReactNode {
  const t = useTranslations("admin.coupons");
  const tUi = useTranslations("ui");
  const tPillars = useTranslations("admin.overview.pillars");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const { data, isPending, isError, refetch } = useAdminCoupons();

  const [query, setQuery] = useState("");
  const [scope, setScope] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCoupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCoupon | null>(null);

  usePageHeaderAction("add", () => {
    setEditing(null);
    setEditorOpen(true);
  });

  const listings = useMemo(() => listCouponListings(), []);
  const providers = useMemo(() => couponProviderOptions(), []);

  function scopeLabel(row: AdminCoupon): string {
    return couponScopeLabel(
      row,
      loc,
      (value) => t(`scope.${value}`),
      tPillars,
      providers,
      listings,
    );
  }

  function discountLabel(row: AdminCoupon): string {
    if (row.discountKind === "percent") {
      return t("percentOff", { value: row.discountValue });
    }
    return formatSyp(row.discountValue, loc);
  }

  const filtered = useMemo(() => {
    if (!data) {
      return [];
    }
    const needle = query.trim().toLowerCase();
    return data.filter((row) => {
      if (scope !== ALL && row.scope !== scope) {
        return false;
      }
      if (status !== ALL && couponStatus(row) !== status) {
        return false;
      }
      if (!needle) {
        return true;
      }
      const haystack = `${row.title.en} ${row.title.ar} ${row.code} ${couponScopeLabel(row, loc, (value) => t(`scope.${value}`), tPillars, providers, listings)}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [data, listings, loc, providers, query, scope, status, t, tPillars]);

  const paging = usePagination(filtered, `${query}|${scope}|${status}`);

  function openEdit(row: AdminCoupon): void {
    setEditing(row);
    setEditorOpen(true);
  }

  const columns: TableColumn<AdminCoupon>[] = [
    {
      id: "title",
      header: t("columns.title"),
      cell: (row) => (
        <span className="truncate font-medium">{localizedName(row.title, loc)}</span>
      ),
    },
    {
      id: "code",
      header: t("columns.code"),
      cell: (row) => (
        <span className="font-mono text-xs tracking-wide">{row.code}</span>
      ),
    },
    {
      id: "discount",
      header: t("columns.discount"),
      cell: (row) => discountLabel(row),
    },
    {
      id: "scope",
      header: t("columns.scope"),
      cell: (row) => (
        <span className="truncate">
          {t(`scope.${row.scope}`)}
          {row.scope !== "platform" ? ` · ${scopeLabel(row)}` : ""}
        </span>
      ),
    },
    {
      id: "start",
      header: t("columns.start"),
      cell: (row) => (
        <span className="text-prose-muted whitespace-nowrap">
          {formatMediumDate(row.startAt, loc)}
        </span>
      ),
    },
    {
      id: "end",
      header: t("columns.end"),
      cell: (row) => (
        <span className="text-prose-muted whitespace-nowrap">
          {formatMediumDate(row.endAt, loc)}
        </span>
      ),
    },
    {
      id: "status",
      header: t("columns.status"),
      cell: (row) => {
        const value = couponStatus(row);
        return <Badge {...statusBadgeProps(value)}>{t(`status.${value}`)}</Badge>;
      },
    },
    {
      id: "actions",
      header: t("columns.actions"),
      align: "end",
      cell: (row) => (
        <div
          className="inline-flex"
          onClick={stopMenuEvent}
          onPointerDown={stopMenuEvent}
          onKeyDown={stopMenuEvent}
        >
          <AdminEditDeleteMenu
            label={t("actionMenu", { name: localizedName(row.title, loc) })}
            editLabel={t("actionEdit")}
            deleteLabel={t("actionDelete")}
            onEdit={() => openEdit(row)}
            onDelete={() => setDeleteTarget(row)}
          />
        </div>
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
      <>
        <EmptyState
          className="flex-1 justify-center"
          icon={TicketPercent}
          title={tUi("emptyTitle")}
          description={t("empty")}
        />
        <AdminCouponModal
          open={editorOpen}
          coupon={editing}
          onClose={() => setEditorOpen(false)}
        />
      </>
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
            id: "scope",
            label: t("columns.scope"),
            value: scope,
            onChange: setScope,
            options: [
              { value: ALL, label: t("allScopes") },
              ...COUPON_SCOPES.map((value: CouponScope) => ({
                value,
                label: t(`scope.${value}`),
              })),
            ],
          },
          {
            id: "status",
            label: t("columns.status"),
            value: status,
            onChange: setStatus,
            options: [
              { value: ALL, label: t("allStatuses") },
              ...COUPON_STATUSES.map((value) => ({
                value,
                label: t(`status.${value}`),
              })),
            ],
          },
        ]}
      />
      <Table
        fill
        columns={columns}
        rows={paging.rows}
        getRowId={(row) => row.id}
        onRowClick={openEdit}
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
      <AdminCouponModal
        open={editorOpen}
        coupon={editing}
        onClose={() => setEditorOpen(false)}
      />
      <AdminCouponDeleteDialog
        coupon={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
