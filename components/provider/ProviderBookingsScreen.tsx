"use client";

import { CalendarCheck, CalendarDays, FilterX, Phone, StickyNote, UsersRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState, type ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Table, type TableColumn } from "@/components/ui/Table";
import { providerBookingPath } from "@/config/providerRoutes";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import { useProviderBookings } from "@/hooks/useProviderBookings";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import { localizedName } from "@/lib/i18n/localized";
import type { TouristBookingStatus } from "@/lib/mock/bookings";
import type { ProviderBooking } from "@/lib/mock/providerBookings";

const ALL_STATUSES = "all";
const STATUSES: TouristBookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "CANCELLED",
  "NO_SHOW",
];

function statusBadge(status: TouristBookingStatus): {
  variant: "solid" | "glass" | "outline";
  className?: string;
} {
  if (status === "CHECKED_IN") return { variant: "solid" };
  if (status === "PENDING" || status === "CONFIRMED") {
    return { variant: "glass", className: "text-accent" };
  }
  return { variant: "outline", className: "border-destructive text-destructive" };
}

export function ProviderBookingsScreen(): ReactNode {
  const t = useTranslations("provider.bookings");
  const tUi = useTranslations("ui");
  const rawLocale = useLocale();
  const locale: Locale = rawLocale === "ar" ? "ar" : "en";
  const formatMoney = useFormatSyp();
  const query = useProviderBookings();
  const [date, setDate] = useState("");
  const [status, setStatus] = useState(ALL_STATUSES);

  const filtered = useMemo(() => {
    return (query.data ?? []).filter((booking) => {
      const matchesDate = !date || booking.scheduledAt.slice(0, 10) === date;
      const matchesStatus = status === ALL_STATUSES || booking.status === status;
      return matchesDate && matchesStatus;
    });
  }, [date, query.data, status]);

  const columns: TableColumn<ProviderBooking>[] = [
    {
      id: "guest",
      header: t("columns.guest"),
      cell: (booking) => (
        <div className="min-w-52">
          <p className="font-semibold">{localizedName(booking.guestName, locale)}</p>
          <p className="text-prose-muted mt-1 flex items-center gap-1.5 text-xs" dir="ltr">
            <Phone className="size-3.5" aria-hidden />
            {booking.phone}
          </p>
        </div>
      ),
    },
    {
      id: "arrival",
      header: t("columns.arrival"),
      cell: (booking) => (
        <div className="whitespace-nowrap">
          <p className="font-medium">{formatMediumDate(booking.scheduledAt, locale)}</p>
          <p className="text-prose-muted mt-1 text-xs">{localizedName(booking.roomName, locale)}</p>
        </div>
      ),
    },
    {
      id: "party",
      header: t("columns.party"),
      cell: (booking) => (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <UsersRound className="text-prose-muted size-4" aria-hidden />
          {t("party", { count: booking.partySize })}
        </span>
      ),
    },
    {
      id: "notes",
      header: t("columns.notes"),
      cell: (booking) => (
        <span className="text-prose-muted flex max-w-64 items-start gap-1.5 text-xs leading-relaxed">
          <StickyNote className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span className="line-clamp-2">{booking.notes}</span>
        </span>
      ),
    },
    {
      id: "amount",
      header: t("columns.amount"),
      align: "end",
      cell: (booking) => (
        <span className="whitespace-nowrap font-semibold tabular-nums">
          {formatMoney(booking.cashDueSyp)}
        </span>
      ),
    },
    {
      id: "status",
      header: t("columns.status"),
      cell: (booking) => (
        <Badge {...statusBadge(booking.status)}>{t(`status.${booking.status}`)}</Badge>
      ),
    },
  ];

  if (query.isError) {
    return (
      <ErrorState
        title={tUi("errorTitle")}
        description={tUi("errorDescription")}
        retryLabel={tUi("retry")}
        onRetry={() => void query.refetch()}
      />
    );
  }

  if (!query.isPending && query.data?.length === 0) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title={t("empty.title")}
        description={t("empty.description")}
      />
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <GlassPanel className="flex flex-col gap-3 p-4 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1">
          <label className="text-prose-muted mb-1.5 block text-xs font-semibold" htmlFor="provider-booking-date">
            {t("filters.date")}
          </label>
          <Input
            id="provider-booking-date"
            type="date"
            variant="glass"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div className="min-w-0 flex-1">
          <Select
            variant="glass"
            label={t("filters.status")}
            value={status}
            onChange={setStatus}
            options={[
              { value: ALL_STATUSES, label: t("filters.allStatuses") },
              ...STATUSES.map((value) => ({ value, label: t(`status.${value}`) })),
            ]}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={!date && status === ALL_STATUSES}
          onClick={() => {
            setDate("");
            setStatus(ALL_STATUSES);
          }}
        >
          <FilterX className="size-4" aria-hidden />
          {t("filters.clear")}
        </Button>
      </GlassPanel>

      <Table
        fill
        columns={columns}
        rows={filtered}
        getRowId={(booking) => booking.id}
        getRowHref={(booking) => providerBookingPath(booking.id)}
        caption={t("caption")}
        emptyMessage={t("empty.filtered")}
        isLoading={query.isPending}
        loadingRowCount={6}
      />

      {!query.isPending ? (
        <p className="text-prose-muted flex items-center gap-2 text-xs">
          <CalendarDays className="size-4" aria-hidden />
          {t("results", { count: filtered.length })}
        </p>
      ) : null}
    </div>
  );
}
