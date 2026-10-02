"use client";

import { CalendarCheck, CalendarDays, FilterX, Phone, StickyNote, UsersRound } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useMemo, useState, type ReactNode } from "react";

import { BookingStatusBadge } from "@/components/bookings/BookingStatusBadge";
import { useProviderCategory } from "@/components/provider/ProviderCategoryContext";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { StackedMoney } from "@/components/ui/StackedMoney";
import { Table, type TableColumn } from "@/components/ui/Table";
import { providerBookingPath } from "@/config/providerRoutes";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import { useProviderBookings } from "@/hooks/useProviderBookings";
import { useStayTranslations } from "@/hooks/useStayTranslations";
import type { Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/translations";
import { formatMediumDate } from "@/lib/format/datetime";
import { partSeparator } from "@/lib/format/separators";
import { localizedName } from "@/lib/i18n/localized";
import { TOURIST_BOOKING_STATUSES } from "@/lib/mock/bookings";
import type { ProviderBooking } from "@/lib/mock/providerBookings";

const ALL_STATUSES = "all";
export function ProviderBookingsScreen(): ReactNode {
  const t = useStayTranslations("provider.bookings");
  const tUi = useTranslations("ui");
  const tStatus = useTranslations("bookings.voucher.status");
  const rawLocale = useLocale();
  const locale: Locale = rawLocale === "ar" ? "ar" : "en";
  const formatMoney = useFormatSyp();
  const category = useProviderCategory();
  const query = useProviderBookings(category);
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
        <div className="min-w-36">
          <p className="font-semibold"><bdi>{localizedName(booking.guestName, locale)}</bdi></p>
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
        <div className="max-w-36">
          <p className="font-medium whitespace-nowrap">{formatMediumDate(booking.scheduledAt, locale)}</p>
          <p className="text-prose-muted mt-1 text-xs"><bdi>{localizedName(booking.offeringName, locale)}</bdi></p>
        </div>
      ),
    },
    {
      id: "party",
      header: t("columns.party"),
      cell: (booking) => (
        <span className="whitespace-nowrap">{t("party", { count: booking.partySize })}</span>
      ),
    },
    {
      id: "notes",
      header: t("columns.notes"),
      cell: (booking) => (
        <span className="text-prose-muted flex min-w-28 max-w-32 items-start gap-1.5 text-xs leading-relaxed">
          <StickyNote className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <bdi>{booking.notes}</bdi>
        </span>
      ),
    },
    {
      id: "amount",
      header: t("columns.amount"),
      align: "end",
      cell: (booking) => (
        <StackedMoney amountSyp={booking.cashDueSyp} locale={locale} strong />
      ),
    },
    {
      id: "status",
      header: t("columns.status"),
      cell: (booking) => (
        <BookingStatusBadge status={booking.status} />
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
          <DatePicker
            variant="glass"
            label={t("filters.date")}
            value={date}
            onChange={setDate}
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
              ...TOURIST_BOOKING_STATUSES.map((value) => ({ value, label: tStatus(value) })),
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

      {/* Phones: one card per booking instead of the wide table. */}
      <ul className="flex flex-col gap-3 sm:hidden" aria-label={t("caption")}>
        {query.isPending
          ? Array.from({ length: 4 }, (_, index) => (
              <li key={index}>
                <Skeleton className="h-36" />
              </li>
            ))
          : null}
        {!query.isPending && filtered.length === 0 ? (
          <li className="text-prose-muted py-6 text-center text-sm">{t("empty.filtered")}</li>
        ) : null}
        {filtered.map((booking) => (
          <li key={booking.id}>
            <Link
              href={providerBookingPath(booking.id)}
              className="focus-visible:outline-ring rounded-glass block focus-visible:outline-2"
            >
              <GlassPanel className="flex-none gap-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-prose font-semibold"><bdi>{localizedName(booking.guestName, locale)}</bdi></p>
                  <BookingStatusBadge status={booking.status} />
                </div>
                <p className="text-prose-muted flex items-center gap-1.5 text-xs">
                  <Phone className="size-3.5" aria-hidden />
                  <span dir="ltr">{booking.phone}</span>
                </p>
                <p className="text-prose flex flex-wrap items-center gap-x-1.5 text-sm">
                  <CalendarDays className="text-prose-muted size-4" aria-hidden />
                  <span className="text-prose-muted">{t("columns.arrival")}</span>
                  {formatMediumDate(booking.scheduledAt, locale)}{partSeparator(locale)}<bdi>{localizedName(booking.offeringName, locale)}</bdi>
                </p>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-prose-muted inline-flex items-center gap-1.5">
                    <UsersRound className="size-4" aria-hidden />
                    {t("party", { count: booking.partySize })}
                  </span>
                  <span className="text-prose font-semibold tabular-nums">
                    {formatMoney(booking.cashDueSyp)}
                  </span>
                </div>
              </GlassPanel>
            </Link>
          </li>
        ))}
      </ul>
      <div className="hidden min-h-0 flex-1 flex-col sm:flex">
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
      </div>

      {!query.isPending ? (
        <p className="text-prose-muted flex items-center gap-2 text-xs">
          <CalendarDays className="size-4" aria-hidden />
          {t("results", { count: filtered.length })}
        </p>
      ) : null}
    </div>
  );
}
