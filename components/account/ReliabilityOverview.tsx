"use client";

import { CalendarCheck, CircleAlert, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTouristAccount } from "@/hooks/useTouristAccount";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";

const TIERS = ["VIP", "STANDARD", "RESTRICTED", "SUSPENDED"] as const;

export function ReliabilityOverview(): ReactNode {
  const t = useTranslations("account.reliability");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const query = useTouristAccount();

  if (query.isPending) return <Skeleton className="h-[32rem]" />;
  if (query.isError) return <ErrorState title={t("errorTitle")} description={t("errorBody")} retryLabel={t("retry")} onRetry={() => void query.refetch()} />;
  const account = query.data;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <GlassPanel className="items-center p-7 text-center">
          <div className="relative grid size-44 place-items-center rounded-full" style={{ background: `conic-gradient(var(--primary) ${account.reliabilityScore}%, var(--border) 0)` }}>
            <div className="bg-surface grid size-36 place-items-center rounded-full"><div><p className="font-heading text-prose text-5xl font-semibold">{account.reliabilityScore}</p><p className="text-prose-muted text-xs">{t("outOf")}</p></div></div>
          </div>
          <span className="bg-primary/12 text-primary mt-5 rounded-full px-4 py-1.5 text-sm font-bold">{t(`tiers.${account.tier}`)}</span>
          <p className="text-prose-muted mt-4 text-sm leading-relaxed">{t("scoreExplanation")}</p>
        </GlassPanel>

        <div className="grid gap-4 sm:grid-cols-3">
          <GlassPanel className="p-6"><CalendarCheck className="text-primary size-6" aria-hidden /><p className="font-heading text-prose mt-4 text-3xl font-semibold">{account.completedCheckIns}</p><p className="text-prose-muted mt-1 text-sm">{t("completed")}</p></GlassPanel>
          <GlassPanel className="p-6"><CircleAlert className="text-accent size-6" aria-hidden /><p className="font-heading text-prose mt-4 text-3xl font-semibold">{account.noShows}</p><p className="text-prose-muted mt-1 text-sm">{t("noShows")}</p></GlassPanel>
          <GlassPanel className="p-6"><Gauge className="text-primary size-6" aria-hidden /><p className="font-heading text-prose mt-4 text-3xl font-semibold">{account.concurrentBookingCap}</p><p className="text-prose-muted mt-1 text-sm">{t("bookingCap")}</p></GlassPanel>
          <GlassPanel className="p-6 sm:col-span-3"><div className="flex gap-3"><Sparkles className="text-primary mt-0.5 size-5 shrink-0" aria-hidden /><div><p className="text-prose font-semibold">{t("instantTitle")}</p><p className="text-prose-muted mt-1 text-sm">{account.instantBooking ? t("instantEnabled") : t("instantDisabled")}</p></div></div><div className="border-border mt-5 border-t pt-5"><p className="text-prose text-sm font-semibold">{t("noShowRule")}</p><p className="text-prose-muted mt-1 text-sm leading-relaxed">{t("noShowRuleBody")}</p></div></GlassPanel>
        </div>
      </div>

      <GlassPanel className="p-6 sm:p-8">
        <h2 className="font-heading text-prose text-2xl font-semibold">{t("historyTitle")}</h2>
        <div className="mt-5 space-y-3">
          {account.history.map((event) => (
            <div key={event.id} className="bg-glass-control flex items-center gap-4 rounded-2xl p-4">
              <span className="bg-primary/12 text-primary grid size-10 place-items-center rounded-full"><ShieldCheck className="size-4" aria-hidden /></span>
              <div className="min-w-0 flex-1"><p className="text-prose font-semibold">{t(`events.${event.kind}`)}</p><p className="text-prose-muted text-xs">{formatMediumDate(event.date, loc)}</p></div>
              <span className="text-prose-muted text-sm font-semibold">{event.points === 0 ? t("noChange") : event.points}</span>
            </div>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel className="p-6 sm:p-8">
        <h2 className="font-heading text-prose text-2xl font-semibold">{t("tiersTitle")}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {TIERS.map((tier) => <div key={tier} className={tier === account.tier ? "border-primary bg-primary/8 rounded-2xl border p-4" : "border-border rounded-2xl border p-4"}><p className="text-prose font-semibold">{t(`tiers.${tier}`)}</p><p className="text-prose-muted mt-2 text-sm leading-relaxed">{t(`tierDetails.${tier}`)}</p></div>)}
        </div>
      </GlassPanel>
    </div>
  );
}
