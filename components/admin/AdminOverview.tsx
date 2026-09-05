"use client";

import { useState, type ReactNode } from "react";
import { format } from "date-fns";
import {
  Building2,
  CircleCheck,
  Inbox,
  Percent,
  Scale,
  UserX,
  Wallet,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { ADMIN_PATHS } from "@/config/adminRoutes";
import { BarList, ChartCard, KpiCard } from "@/components/admin/OverviewPrimitives";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SegmentSwitch } from "@/components/ui/SegmentSwitch";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAdminOverview } from "@/hooks/useAdminOverview";
import { dateFnsLocale } from "@/lib/format/datetime";
import { formatSyp } from "@/lib/format/money";
import { formatCount, formatPercent } from "@/lib/format/number";
import type { Locale } from "@/i18n/config";
import type { AdminAttractionKey, AdminOriginIso } from "@/lib/mock/adminOverview";
import type { LandingPillarId } from "@/lib/mock/landing";

function OverviewSkeleton(): ReactNode {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-32" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}

export function AdminOverview(): ReactNode {
  const t = useTranslations("admin.overview");
  const tGov = useTranslations("landing.governorates");
  const tUi = useTranslations("ui");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";

  const [periodDays, setPeriodDays] = useState<number>(30);
  const { data, isPending, isError, refetch } = useAdminOverview(periodDays);

  const originLabel: Record<AdminOriginIso, string> = {
    SY: t("origins.syria"),
    LB: t("origins.lebanon"),
    JO: t("origins.jordan"),
    AE: t("origins.uae"),
    DE: t("origins.germany"),
    FR: t("origins.france"),
    other: t("origins.other"),
  };

  const attractionLabel: Record<AdminAttractionKey, string> = {
    umayyadMosque: t("attractions.umayyadMosque"),
    aleppoCitadel: t("attractions.aleppoCitadel"),
    palmyra: t("attractions.palmyra"),
    krak: t("attractions.krak"),
    bosraTheatre: t("attractions.bosraTheatre"),
  };

  const pillarLabel: Record<LandingPillarId, string> = {
    hotels: t("pillars.hotels"),
    dining: t("pillars.dining"),
    trips: t("pillars.trips"),
    events: t("pillars.events"),
    guides: t("pillars.guides"),
  };

  if (isPending) {
    return <OverviewSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title={tUi("errorTitle")}
        description={tUi("errorDescription")}
        retryLabel={tUi("retry")}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon={Inbox}
        title={tUi("emptyTitle")}
        description={t("empty")}
      />
    );
  }

  const maxNoShow = Math.max(...data.noShowByCity.map((row) => row.rate), 0.001);
  const maxOrigin = Math.max(...data.origins.map((row) => row.share), 0.001);
  const maxVisits = Math.max(...data.topAttractions.map((row) => row.visits), 1);
  const maxCommission = Math.max(
    ...data.commissionByPillar.map((row) => row.amountSyp),
    1,
  );
  const maxVolume = Math.max(...data.volume.map((row) => row.count), 1);
  const periodHint = t("periodHint", { days: data.periodDays });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 shrink-0">
        <span className="text-prose-muted text-xs font-semibold tracking-wide uppercase">
          {periodHint}
        </span>
        <div className="w-auto">
          <SegmentSwitch
            variant="glass"
            size="sm"
            aria-label={t("periodLabel")}
            value={String(periodDays)}
            onChange={(val) => setPeriodDays(Number(val))}
            options={[
              { value: "7", label: t("days7") },
              { value: "30", label: t("days30") },
              { value: "90", label: t("days90") },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        <KpiCard
          icon={Wallet}
          label={t("grossBookings")}
          value={formatSyp(data.kpis.grossBookingsSyp, loc)}
          hint={periodHint}
          href={ADMIN_PATHS.bookings}
        />
        <KpiCard
          icon={CircleCheck}
          label={t("completed")}
          value={formatCount(data.kpis.completedCount, loc)}
          hint={periodHint}
          href={ADMIN_PATHS.bookings}
        />
        <KpiCard
          icon={UserX}
          label={t("noShowRate")}
          value={formatPercent(data.kpis.noShowRate, loc)}
          hint={periodHint}
          href={ADMIN_PATHS.noShows}
        />
        <KpiCard
          icon={Percent}
          label={t("commissionRevenue")}
          value={formatSyp(data.kpis.commissionRevenueSyp, loc)}
          hint={periodHint}
          href={ADMIN_PATHS.accounts}
        />
        <KpiCard
          icon={Building2}
          label={t("pendingProviders")}
          value={formatCount(data.kpis.pendingProviders, loc)}
          hint={t("pendingProvidersHint")}
          href={ADMIN_PATHS.businesses}
        />
        <KpiCard
          icon={Scale}
          label={t("openDisputes")}
          value={formatCount(data.kpis.openDisputes, loc)}
          hint={t("openDisputesHint")}
          href={ADMIN_PATHS.noShows}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title={t("volumeTitle")}>
          <div className="flex h-52 items-end gap-2 sm:gap-3">
            {data.volume.map((day) => {
              const height = (day.count / maxVolume) * 100;
              const label = format(new Date(`${day.date}T12:00:00`), "EEE", {
                locale: dateFnsLocale(loc),
              });
              return (
                <div key={day.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <span className="text-prose-muted text-xs tabular-nums">
                    {formatCount(day.count, loc)}
                  </span>
                  <div className="bg-glass-control backdrop-blur-sm flex h-40 w-full items-end overflow-hidden rounded-t-lg">
                    <div
                      className="bg-primary w-full rounded-t-lg"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                  </div>
                  <span className="text-prose-muted text-xs font-medium">{label}</span>
                </div>
              );
            })}
          </div>
        </ChartCard>

        <ChartCard title={t("noShowByCity")}>
          <BarList
            rows={data.noShowByCity.map((row) => ({
              id: row.governorate,
              label: tGov(row.governorate),
              display: formatPercent(row.rate, loc),
              ratio: row.rate / maxNoShow,
            }))}
          />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title={t("originsTitle")}>
          <BarList
            rows={data.origins.map((row) => ({
              id: row.id,
              label: originLabel[row.id],
              display: formatPercent(row.share, loc, 0),
              ratio: row.share / maxOrigin,
            }))}
          />
        </ChartCard>

        <ChartCard title={t("attractionsTitle")}>
          <BarList
            rows={data.topAttractions.map((row) => ({
              id: row.key,
              label: attractionLabel[row.key],
              hint: tGov(row.governorate),
              display: formatCount(row.visits, loc),
              ratio: row.visits / maxVisits,
            }))}
          />
        </ChartCard>

        <ChartCard title={t("commissionByPillar")}>
          <BarList
            rows={data.commissionByPillar.map((row) => ({
              id: row.pillar,
              label: pillarLabel[row.pillar],
              display: formatSyp(row.amountSyp, loc),
              ratio: row.amountSyp / maxCommission,
            }))}
          />
        </ChartCard>
      </div>
    </div>
  );
}
