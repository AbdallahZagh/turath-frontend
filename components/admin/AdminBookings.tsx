"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarCheck, Download } from "lucide-react";

import { AdminBookingDetail } from "@/components/admin/AdminBookingDetail";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { AdminNamedRating } from "@/components/admin/AdminNamedRating";
import { bookingStatusBadgeProps } from "@/components/admin/bookingStatus";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Table, type TableColumn } from "@/components/ui/Table";
import { useAdminBookings } from "@/hooks/useAdminBookings";
import { usePagination } from "@/hooks/usePagination";
import type { Locale } from "@/i18n/config";
import { exportToCsv } from "@/lib/export/csv";
import { formatBookingWhen } from "@/lib/format/booking";
import { formatSyp } from "@/lib/format/money";
import { localizedName } from "@/lib/i18n/localized";
import { BOOKING_STATUSES, matchesAdminBookingQuery, type AdminBooking } from "@/lib/mock/adminBookings";
import type { LandingPillarId } from "@/lib/mock/landing";

const ALL = "all";

const PILLARS: LandingPillarId[] = ["hotels", "dining", "trips", "events", "guides"];

export function AdminBookings(): ReactNode {
  const t = useTranslations("admin.bookings");
  const tPillars = useTranslations("admin.overview.pillars");
  const tUi = useTranslations("ui");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const { data, isPending, isError, refetch } = useAdminBookings();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<AdminBooking | null>(null);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const filtered = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.filter((booking) => {
      if (category !== ALL && booking.category !== category) {
        return false;
      }
      if (status !== ALL && booking.status !== status) {
        return false;
      }
      return matchesAdminBookingQuery(booking, query);
    });
  }, [data, category, status, query]);

  const handleExportCsv = useCallback(() => {
    const headers = [
      t("columns.code"),
      t("columns.guest"),
      t("columns.provider"),
      t("columns.category"),
      t("columns.when"),
      t("columns.amount"),
      t("columns.status"),
      t("columns.coupon"),
    ];
    const rows = filtered.map((booking) => [
      booking.code,
      localizedName(booking.guest, loc),
      localizedName(booking.provider, loc),
      tPillars(booking.category),
      formatBookingWhen(booking.when, loc),
      booking.amountSyp,
      t(`status.${booking.status}`),
      booking.couponCode ?? "",
    ]);
    exportToCsv(`turath-bookings-${new Date().toISOString().slice(0, 10)}`, headers, rows);
  }, [filtered, loc, t, tPillars]);

  const paging = usePagination(filtered, `${query}|${category}|${status}`);

  const columns: TableColumn<AdminBooking>[] = [
    {
      id: "guest",
      header: t("columns.guest"),
      cell: (booking) => (
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate font-medium">{localizedName(booking.guest, loc)}</span>
          <AdminNamedRating about="guest" nameEn={booking.guest.en} />
          <span className="text-prose-muted truncate text-xs tabular-nums">{booking.phone}</span>
        </div>
      ),
    },
    {
      id: "provider",
      header: t("columns.provider"),
      cell: (booking) => (
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate font-medium">{localizedName(booking.provider, loc)}</span>
          <AdminNamedRating about="provider" nameEn={booking.provider.en} />
          <span className="text-prose-muted truncate text-xs">{tPillars(booking.category)}</span>
        </div>
      ),
    },
    {
      id: "when",
      header: t("columns.when"),
      cell: (booking) => (
        <span className="text-prose-muted whitespace-nowrap">
          {formatBookingWhen(booking.when, loc)}
        </span>
      ),
    },
    {
      id: "amount",
      header: t("columns.amount"),
      align: "end",
      cell: (booking) => (
        <span className="font-medium tabular-nums whitespace-nowrap">
          {formatSyp(booking.amountSyp, loc)}
        </span>
      ),
    },
    {
      id: "status",
      header: t("columns.status"),
      cell: (booking) => (
        <Badge {...bookingStatusBadgeProps(booking.status)}>
          {t(`status.${booking.status}`)}
        </Badge>
      ),
    },
    {
      id: "code",
      header: t("columns.code"),
      cell: (booking) => (
        <span className="font-medium tracking-wider tabular-nums">{booking.code}</span>
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
        icon={CalendarCheck}
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
            id: "status",
            label: t("columns.status"),
            value: status,
            onChange: setStatus,
            options: [
              { value: ALL, label: t("allStatuses") },
              ...BOOKING_STATUSES.map((value) => ({
                value,
                label: t(`status.${value}`),
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
        getRowId={(booking) => booking.id}
        onRowClick={(booking) => {
          setSelected(booking);
          setDrawerOpen(true);
        }}
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
      <Drawer open={drawerOpen} onClose={closeDrawer} title={t("detail.title")}>
        {selected ? <AdminBookingDetail booking={selected} /> : null}
      </Drawer>
    </div>
  );
}
