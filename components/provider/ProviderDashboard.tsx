"use client";

import { format } from "date-fns";
import {
  BedDouble,
  CalendarClock,
  CircleCheck,
  Inbox,
  UserRoundCheck,
  UserRoundX,
  UsersRound,
  Wallet,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SegmentSwitch } from "@/components/ui/SegmentSwitch";
import { Skeleton } from "@/components/ui/Skeleton";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import { useProviderDashboard } from "@/hooks/useProviderDashboard";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { dateFnsLocale } from "@/lib/format/datetime";
import { formatCount, formatPercent } from "@/lib/format/number";
import { localizedName } from "@/lib/i18n/localized";
import { useAuthStore } from "@/store/authStore";

type MetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
};

function MetricCard({ icon: Icon, label, value, hint }: MetricCardProps): ReactNode {
  return (
    <GlassPanel className="flex min-w-0 flex-col gap-3 p-5">
      <div className="flex items-center gap-2">
        <span className="bg-option-hover text-accent grid size-8 place-items-center rounded-full">
          <Icon className="size-4" aria-hidden />
        </span>
        <p className="text-prose-muted text-xs font-semibold uppercase tracking-wide">
          {label}
        </p>
      </div>
      <p className="font-heading text-prose wrap-break-word text-xl font-semibold tracking-tight sm:text-2xl">
        {value}
      </p>
      <p className="text-prose-muted text-xs leading-relaxed">{hint}</p>
    </GlassPanel>
  );
}

function DashboardSkeleton(): ReactNode {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-36" />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}

export function ProviderDashboard(): ReactNode {
  const t = useTranslations("provider.dashboard");
  const tUi = useTranslations("ui");
  const rawLocale = useLocale();
  const locale: Locale = rawLocale === "ar" ? "ar" : "en";
  const formatMoney = useFormatSyp();
  const role = useAuthStore((state) => state.user.role);
  const [periodDays, setPeriodDays] = useState(30);
  const query = useProviderDashboard(periodDays);

  if (query.isPending) {
    return <DashboardSkeleton />;
  }

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

  if (!query.data) {
    return (
      <EmptyState
        icon={Inbox}
        title={tUi("emptyTitle")}
        description={t("empty")}
      />
    );
  }

  const data = query.data;
  const maxBookings = Math.max(...data.bookingTrend.map((item) => item.count), 1);
  const creditUsed =
    data.finance.creditCeilingSyp > 0
      ? data.finance.outstandingCommissionSyp / data.finance.creditCeilingSyp
      : 0;
  const periodHint = t("periodHint", { days: periodDays });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-prose text-sm font-semibold">{t("welcome")}</p>
          <p className="text-prose-muted mt-1 text-xs">{periodHint}</p>
        </div>
        <SegmentSwitch
          variant="glass"
          size="sm"
          aria-label={t("periodLabel")}
          value={String(periodDays)}
          onChange={(value) => setPeriodDays(Number(value))}
          options={[
            { value: "7", label: t("days7") },
            { value: "30", label: t("days30") },
            { value: "90", label: t("days90") },
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        <MetricCard
          icon={Wallet}
          label={t("metrics.revenue")}
          value={formatMoney(data.kpis.collectedRevenueSyp)}
          hint={t("metrics.revenueHint")}
        />
        <MetricCard
          icon={UsersRound}
          label={t("metrics.upcoming")}
          value={formatCount(data.kpis.upcomingGuests, locale)}
          hint={t("metrics.upcomingHint")}
        />
        <MetricCard
          icon={BedDouble}
          label={t("metrics.occupancy")}
          value={formatPercent(data.kpis.occupancyRate, locale, 0)}
          hint={t("metrics.occupancyHint")}
        />
        <MetricCard
          icon={UserRoundCheck}
          label={t("metrics.checkIns")}
          value={formatCount(data.kpis.checkInsToday, locale)}
          hint={t("metrics.checkInsHint")}
        />
        <MetricCard
          icon={XCircle}
          label={t("metrics.cancellations")}
          value={formatCount(data.kpis.cancellations, locale)}
          hint={periodHint}
        />
        <MetricCard
          icon={UserRoundX}
          label={t("metrics.noShows")}
          value={formatCount(data.kpis.noShows, locale)}
          hint={periodHint}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
        <GlassPanel className="p-5 sm:p-6">
          <h2 className="font-heading text-prose text-xl font-semibold">
            {t("bookingActivity")}
          </h2>
          <div className="mt-6 flex h-56 items-end gap-2 sm:gap-3">
            {data.bookingTrend.map((item) => {
              const height = Math.max((item.count / maxBookings) * 100, 5);
              return (
                <div
                  key={item.date}
                  className="flex min-w-0 flex-1 flex-col items-center gap-2"
                >
                  <span className="text-prose-muted text-xs tabular-nums">
                    {formatCount(item.count, locale)}
                  </span>
                  <div className="bg-glass-control flex h-40 w-full items-end overflow-hidden rounded-t-lg backdrop-blur-sm">
                    <div
                      className="bg-primary w-full rounded-t-lg"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-prose-muted text-xs font-medium">
                    {format(new Date(`${item.date}T12:00:00`), "EEE", {
                      locale: dateFnsLocale(locale),
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassPanel>

        {role === "PROVIDER_OWNER" ? (
          <GlassPanel className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-primary text-xs font-bold uppercase tracking-[0.14em]">
                  {t("finance.eyebrow")}
                </p>
                <h2 className="font-heading text-prose mt-2 text-xl font-semibold">
                  {t("finance.title")}
                </h2>
              </div>
              <Wallet className="text-primary size-5" aria-hidden />
            </div>
            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-prose-muted text-sm">{t("finance.accrued")}</dt>
                <dd className="text-prose text-sm font-semibold">
                  {formatMoney(data.finance.accruedCommissionSyp)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-prose-muted text-sm">{t("finance.paid")}</dt>
                <dd className="text-prose text-sm font-semibold">
                  {formatMoney(data.finance.paidCommissionSyp)}
                </dd>
              </div>
              <div className="border-border flex items-center justify-between gap-4 border-t pt-4">
                <dt className="text-prose-muted text-sm">{t("finance.outstanding")}</dt>
                <dd className="text-prose text-sm font-semibold">
                  {formatMoney(data.finance.outstandingCommissionSyp)}
                </dd>
              </div>
            </dl>
            <div className="mt-6">
              <div className="flex items-center justify-between gap-4 text-xs">
                <span className="text-prose-muted">{t("finance.creditUsed")}</span>
                <span className="text-prose font-semibold">
                  {formatPercent(creditUsed, locale, 0)}
                </span>
              </div>
              <div className="bg-glass-control mt-2 h-2 overflow-hidden rounded-full">
                <div
                  className={cn(
                    "h-full rounded-full",
                    creditUsed >= 0.75 ? "bg-warning" : "bg-primary",
                  )}
                  style={{ width: `${Math.min(creditUsed * 100, 100)}%` }}
                />
              </div>
              <p className="text-prose-muted mt-3 text-xs leading-relaxed">
                {t("finance.ceiling", {
                  amount: formatMoney(data.finance.creditCeilingSyp),
                })}
              </p>
            </div>
          </GlassPanel>
        ) : (
          <GlassPanel className="p-5 sm:p-6">
            <p className="text-primary text-xs font-bold uppercase tracking-[0.14em]">
              {t("staffFocus.eyebrow")}
            </p>
            <h2 className="font-heading text-prose mt-2 text-xl font-semibold">
              {t("staffFocus.title")}
            </h2>
            <p className="text-prose-muted mt-3 text-sm leading-7">
              {t("staffFocus.description")}
            </p>
          </GlassPanel>
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <GlassPanel className="overflow-hidden">
          <div className="border-border flex items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-heading text-prose text-xl font-semibold">
                {t("arrivals.title")}
              </h2>
              <p className="text-prose-muted mt-1 text-xs">
                {t("arrivals.description")}
              </p>
            </div>
            <CalendarClock className="text-primary size-5" aria-hidden />
          </div>
          <ul className="divide-border divide-y">
            {data.arrivals.map((arrival) => (
              <li
                key={arrival.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-prose truncate text-sm font-semibold">
                      {localizedName(arrival.guestName, locale)}
                    </p>
                    <Badge
                      variant={
                        arrival.status === "CONFIRMED" ? "solid" : "outline"
                      }
                    >
                      {t(`arrivals.status.${arrival.status}`)}
                    </Badge>
                  </div>
                  <p className="text-prose-muted mt-1 text-xs">
                    {arrival.id} · {t("arrivals.party", { count: arrival.partySize })}
                  </p>
                </div>
                <div className="shrink-0 sm:text-end">
                  <p className="text-prose text-sm font-semibold">
                    {format(new Date(arrival.startsAt), "p", {
                      locale: dateFnsLocale(locale),
                    })}
                  </p>
                  <p className="text-prose-muted mt-1 text-xs">
                    {formatMoney(arrival.cashDueSyp)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </GlassPanel>

        <GlassPanel className="overflow-hidden">
          <div className="border-border flex items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-heading text-prose text-xl font-semibold">
                {t("recent.title")}
              </h2>
              <p className="text-prose-muted mt-1 text-xs">
                {t("recent.description")}
              </p>
            </div>
            <CircleCheck className="text-primary size-5" aria-hidden />
          </div>
          <ul className="divide-border divide-y">
            {data.recentCheckIns.map((checkIn) => (
              <li
                key={checkIn.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="min-w-0">
                  <p className="text-prose truncate text-sm font-semibold">
                    {localizedName(checkIn.guestName, locale)}
                  </p>
                  <p className="text-prose-muted mt-1 text-xs">
                    {t("recent.checkedInBy", {
                      staff: localizedName(checkIn.staffName, locale),
                    })}
                  </p>
                </div>
                <div className="shrink-0 sm:text-end">
                  <p className="text-prose text-sm font-semibold">
                    {formatMoney(checkIn.cashCollectedSyp)}
                  </p>
                  <p className="text-prose-muted mt-1 text-xs">
                    {format(new Date(checkIn.checkedInAt), "p", {
                      locale: dateFnsLocale(locale),
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </GlassPanel>
      </div>
    </div>
  );
}

