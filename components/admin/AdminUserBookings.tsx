"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";

import { AdminBookingDetail } from "@/components/admin/AdminBookingDetail";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { AdminNamedRating } from "@/components/admin/AdminNamedRating";
import { bookingStatusBadgeProps } from "@/components/admin/bookingStatus";
import { Badge } from "@/components/ui/Badge";
import { Drawer } from "@/components/ui/Drawer";
import { Table, type TableColumn } from "@/components/ui/Table";
import { usePagination } from "@/hooks/usePagination";
import type { Locale } from "@/i18n/config";
import { formatBookingWhen } from "@/lib/format/booking";
import { formatSyp } from "@/lib/format/money";
import { localizedName } from "@/lib/i18n/localized";
import {
  BOOKING_STATUSES,
  matchesAdminBookingQuery,
  type AdminBooking,
} from "@/lib/mock/adminBookings";
import type { LandingPillarId } from "@/lib/mock/landing";

const ALL = "all";

const PILLARS: LandingPillarId[] = ["hotels", "dining", "trips", "events", "guides"];

type AdminUserBookingsProps = {
  bookings: AdminBooking[];
};

export function AdminUserBookings({ bookings }: AdminUserBookingsProps): ReactNode {
  const t = useTranslations("admin.users");
  const tBookings = useTranslations("admin.bookings");
  const tPillars = useTranslations("admin.overview.pillars");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<AdminBooking | null>(null);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const filtered = useMemo(() => {
    return bookings.filter((booking) => {
      if (category !== ALL && booking.category !== category) {
        return false;
      }
      if (status !== ALL && booking.status !== status) {
        return false;
      }
      return matchesAdminBookingQuery(booking, query);
    });
  }, [bookings, category, status, query]);

  const paging = usePagination(filtered, `${query}|${category}|${status}`);

  const columns: TableColumn<AdminBooking>[] = [
    {
      id: "provider",
      header: tBookings("columns.provider"),
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
      header: tBookings("columns.when"),
      cell: (booking) => (
        <span className="text-prose-muted whitespace-nowrap">
          {formatBookingWhen(booking.when, loc)}
        </span>
      ),
    },
    {
      id: "amount",
      header: tBookings("columns.amount"),
      align: "end",
      cell: (booking) => (
        <span className="font-medium tabular-nums whitespace-nowrap">
          {formatSyp(booking.amountSyp, loc)}
        </span>
      ),
    },
    {
      id: "status",
      header: tBookings("columns.status"),
      cell: (booking) => (
        <Badge {...bookingStatusBadgeProps(booking.status)}>
          {tBookings(`status.${booking.status}`)}
        </Badge>
      ),
    },
    {
      id: "code",
      header: tBookings("columns.code"),
      cell: (booking) => (
        <span className="font-medium tracking-wider tabular-nums">{booking.code}</span>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-prose text-lg font-semibold">{t("detail.bookingsTitle")}</h2>
      <AdminFilterBar
        search={query}
        onSearchChange={setQuery}
        searchPlaceholder={tBookings("searchPlaceholder")}
        filters={[
          {
            id: "category",
            label: tBookings("columns.category"),
            value: category,
            onChange: setCategory,
            options: [
              { value: ALL, label: tBookings("allCategories") },
              ...PILLARS.map((id) => ({ value: id, label: tPillars(id) })),
            ],
          },
          {
            id: "status",
            label: tBookings("columns.status"),
            value: status,
            onChange: setStatus,
            options: [
              { value: ALL, label: tBookings("allStatuses") },
              ...BOOKING_STATUSES.map((value) => ({
                value,
                label: tBookings(`status.${value}`),
              })),
            ],
          },
        ]}
      />
      <Table
        columns={columns}
        rows={paging.rows}
        getRowId={(booking) => booking.id}
        onRowClick={(booking) => {
          setSelected(booking);
          setDrawerOpen(true);
        }}
        caption={t("detail.bookingsTitle")}
        emptyMessage={tBookings("emptyFiltered")}
        pagination={{
          page: paging.page,
          pageCount: paging.pageCount,
          pageSize: paging.pageSize,
          total: paging.total,
          onPageChange: paging.setPage,
          onPageSizeChange: paging.setPageSize,
        }}
      />
      <Drawer open={drawerOpen} onClose={closeDrawer} title={tBookings("detail.title")}>
        {selected ? <AdminBookingDetail booking={selected} /> : null}
      </Drawer>
    </section>
  );
}
