"use client";

import {
  BedDouble,
  CalendarCheck,
  CalendarDays,
  CalendarHeart,
  Compass,
  MapPinned,
  ShieldCheck,
  TicketCheck,
  UserRoundSearch,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { USER_PATHS } from "@/config/userRoutes";
import { useTouristBookings } from "@/hooks/useBookings";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import { useTouristAccount } from "@/hooks/useTouristAccount";
import type { Locale } from "@/i18n/config";
import { formatMediumDate, toIsoDate } from "@/lib/format/datetime";
import type { TouristBooking } from "@/lib/mock/bookings";

type DashboardStat = {
  key: string;
  value: string | number;
  label: string;
  icon: LucideIcon;
};

function bookingDate(booking: TouristBooking): string {
  return booking.type === "hotel" ? booking.checkIn : booking.date;
}

function isUpcoming(booking: TouristBooking, today: string): boolean {
  return (booking.status === "PENDING" || booking.status === "CONFIRMED") && bookingDate(booking) >= today;
}

function BookingTypeIcon({ type }: { type: TouristBooking["type"] | null }): ReactNode {
  if (type === "restaurant") return <Utensils className="size-5" aria-hidden />;
  if (type === "trip") return <MapPinned className="size-5" aria-hidden />;
  if (type === "event") return <CalendarHeart className="size-5" aria-hidden />;
  if (type === "guide") return <UserRoundSearch className="size-5" aria-hidden />;
  if (type === "hotel") return <BedDouble className="size-5" aria-hidden />;
  return <Compass className="size-5" aria-hidden />;
}

function DashboardSkeleton(): ReactNode {
  return (
    <div className="space-y-5">
      <Skeleton className="h-72" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-28" />)}
      </div>
      <div className="grid gap-5 xl:grid-cols-2"><Skeleton className="h-72" /><Skeleton className="h-72" /></div>
    </div>
  );
}

export function UserDashboard(): ReactNode {
  const t = useTranslations("account.dashboard");
  const tStatus = useTranslations("bookings.voucher.status");
  const rawLocale = useLocale();
  const locale: Locale = rawLocale === "ar" ? "ar" : "en";
  const formatMoney = useFormatSyp();
  const accountQuery = useTouristAccount();
  const bookingsQuery = useTouristBookings();

  if (accountQuery.isPending || bookingsQuery.isPending) return <DashboardSkeleton />;

  if (accountQuery.isError || bookingsQuery.isError) {
    return (
      <ErrorState
        title={t("error.title")}
        description={t("error.description")}
        retryLabel={t("error.retry")}
        onRetry={() => {
          void accountQuery.refetch();
          void bookingsQuery.refetch();
        }}
      />
    );
  }

  const today = toIsoDate(new Date());
  const upcoming = bookingsQuery.data
    .filter((booking) => isUpcoming(booking, today))
    .sort((first, second) => bookingDate(first).localeCompare(bookingDate(second)));
  const nextBooking = upcoming[0];
  const completed = bookingsQuery.data.filter((booking) => booking.status === "CHECKED_IN").length;
  const availableSlots = Math.max(accountQuery.data.concurrentBookingCap - upcoming.length, 0);
  const stats: DashboardStat[] = [
    { key: "upcoming", value: upcoming.length, label: t("stats.upcoming"), icon: CalendarDays },
    { key: "completed", value: completed, label: t("stats.completed"), icon: CalendarCheck },
    { key: "reliability", value: `${accountQuery.data.reliabilityScore}/100`, label: t("stats.reliability"), icon: ShieldCheck },
    { key: "available", value: availableSlots, label: t("stats.available"), icon: TicketCheck },
  ];

  const discovery = [
    { href: USER_PATHS.hotels, label: t("discover.hotels"), icon: BedDouble },
    { href: USER_PATHS.restaurants, label: t("discover.restaurants"), icon: Utensils },
    { href: USER_PATHS.trips, label: t("discover.trips"), icon: MapPinned },
    { href: USER_PATHS.events, label: t("discover.events"), icon: CalendarHeart },
    { href: USER_PATHS.guides, label: t("discover.guides"), icon: UserRoundSearch },
  ];

  return (
    <div className="flex flex-col gap-5">
      <GlassPanel className="p-6 sm:p-8">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.7fr)]">
          <div>
            <span className="bg-primary/12 text-primary grid size-12 place-items-center rounded-2xl">
              <Compass className="size-6" aria-hidden />
            </span>
            <p className="text-primary mt-5 text-xs font-bold uppercase tracking-[0.16em]">{t("hero.eyebrow")}</p>
            <h2 className="font-heading text-prose mt-2 max-w-2xl text-3xl font-semibold sm:text-4xl">{t("hero.title")}</h2>
            <p className="text-prose-muted mt-3 max-w-2xl text-sm leading-7">{t("hero.description")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={USER_PATHS.hotels}>{t("hero.explore")}</Button>
              <Button href={USER_PATHS.bookings} variant="outline">{t("hero.bookings")}</Button>
            </div>
          </div>

          <div className="bg-glass-control border-border rounded-2xl border p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-prose-muted text-xs font-bold uppercase tracking-wide">{t("next.title")}</p>
              {nextBooking ? <Badge variant="glass" className="text-primary">{tStatus(nextBooking.status)}</Badge> : null}
            </div>
            <span className="bg-primary/12 text-primary mt-5 grid size-11 place-items-center rounded-2xl">
              <BookingTypeIcon type={nextBooking?.type ?? null} />
            </span>
            {nextBooking ? (
              <>
                <h3 className="font-heading text-prose mt-4 text-xl font-semibold">{t(`bookingTypes.${nextBooking.type}`)}</h3>
                <p className="text-prose-muted mt-1 text-sm">{formatMediumDate(bookingDate(nextBooking), locale)}</p>
                <div className="border-border mt-4 flex items-end justify-between gap-4 border-t pt-4">
                  <div>
                    <p className="text-prose-muted text-xs">{nextBooking.reference}</p>
                    <p className="text-prose mt-1 text-sm font-semibold">{formatMoney(nextBooking.cashDueSyp)}</p>
                  </div>
                  <Button href={`/bookings/${nextBooking.id}`} size="sm" variant="outline">{t("next.open")}</Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-heading text-prose mt-4 text-xl font-semibold">{t("next.emptyTitle")}</h3>
                <p className="text-prose-muted mt-2 text-sm leading-relaxed">{t("next.emptyDescription")}</p>
              </>
            )}
          </div>
        </div>
      </GlassPanel>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ key, value, label, icon: Icon }) => (
          <GlassPanel key={key} className="flex h-full flex-row items-center gap-4 p-5">
            <span className="bg-primary/12 text-primary grid size-10 shrink-0 place-items-center rounded-xl">
              <Icon className="size-4" aria-hidden />
            </span>
            <div>
              <p className="font-heading text-prose text-2xl font-semibold tabular-nums">{value}</p>
              <p className="text-prose-muted mt-0.5 text-xs">{label}</p>
            </div>
          </GlassPanel>
        ))}
      </div>

      <div className="grid items-stretch gap-5 xl:grid-cols-2">
        <GlassPanel className="h-full p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-wide">{t("standing.eyebrow")}</p>
              <h2 className="font-heading text-prose mt-2 text-2xl font-semibold">{t(`standing.tiers.${accountQuery.data.tier}`)}</h2>
            </div>
            <p className="font-heading text-prose text-4xl font-semibold tabular-nums">{accountQuery.data.reliabilityScore}</p>
          </div>
          <div className="bg-border mt-5 h-2 overflow-hidden rounded-full">
            <div className="bg-primary h-full rounded-full" style={{ width: `${accountQuery.data.reliabilityScore}%` }} />
          </div>
          <p className="text-prose-muted mt-4 text-sm leading-7">{t("standing.description", { count: accountQuery.data.concurrentBookingCap })}</p>
          <Button href={USER_PATHS.reliability} variant="outline" className="mt-5">{t("standing.open")}</Button>
        </GlassPanel>

        <GlassPanel className="h-full p-6 sm:p-7">
          <p className="text-primary text-xs font-bold uppercase tracking-wide">{t("discover.eyebrow")}</p>
          <h2 className="font-heading text-prose mt-2 text-2xl font-semibold">{t("discover.title")}</h2>
          <p className="text-prose-muted mt-2 text-sm leading-relaxed">{t("discover.description")}</p>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {discovery.map(({ href, label, icon: Icon }) => (
              <Button key={href} href={href} variant="glass" size="sm" className="w-full">
                <Icon className="size-4" aria-hidden />
                {label}
              </Button>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
