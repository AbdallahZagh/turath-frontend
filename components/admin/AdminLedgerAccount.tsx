"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Banknote, Building2, RotateCcw, ShieldOff } from "lucide-react";

import { ADMIN_PATHS } from "@/config/adminRoutes";
import { AdminNamedRating } from "@/components/admin/AdminNamedRating";
import { ledgerStandingBadgeProps } from "@/components/admin/ledgerStanding";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import { initialsFromName } from "@/lib/format/initials";
import { formatSyp } from "@/lib/format/money";
import { localizedName } from "@/lib/i18n/localized";
import { outstandingSyp, type AdminLedgerRow } from "@/lib/mock/adminLedger";

type AdminLedgerAccountProps = {
  ledger: AdminLedgerRow;
  providerId: string | null;
  actionPending: boolean;
  onSuspend: () => void;
  onReinstate: () => void;
  onRecordSettlement: () => void;
};

export function AdminLedgerAccount({
  ledger,
  providerId,
  actionPending,
  onSuspend,
  onReinstate,
  onRecordSettlement,
}: AdminLedgerAccountProps): ReactNode {
  const t = useTranslations("admin.ledger");
  const tPillars = useTranslations("admin.overview.pillars");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const other: Locale = loc === "ar" ? "en" : "ar";
  const displayName = localizedName(ledger.provider, loc);
  const outstanding = outstandingSyp(ledger);
  const canSuspend = ledger.standing === "watch" || ledger.standing === "grace";

  return (
    <GlassPanel className="flex-none gap-5 p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span
            aria-hidden
            className="bg-glass-control text-prose flex size-16 shrink-0 items-center justify-center rounded-full text-lg font-semibold"
          >
            {initialsFromName(displayName)}
          </span>
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-prose text-2xl font-semibold tracking-tight">
                {displayName}
              </h2>
              <Badge {...ledgerStandingBadgeProps(ledger.standing)}>
                {t(`standing.${ledger.standing}`)}
              </Badge>
            </div>
            <p className="text-prose-muted text-sm">{localizedName(ledger.provider, other)}</p>
            <AdminNamedRating
              about="provider"
              nameEn={ledger.provider.en}
              size="md"
              layout="stack"
            />
            <dl className="mt-1 grid gap-3 text-sm sm:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-0.5">
                <dt className="text-prose-muted text-xs">{t("categoryLabel")}</dt>
                <dd>{tPillars(ledger.category)}</dd>
              </div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <dt className="text-prose-muted text-xs">{t("columns.cadence")}</dt>
                <dd>{t(`cadence.${ledger.cadence}`)}</dd>
              </div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <dt className="text-prose-muted text-xs">{t("detail.lastSettled")}</dt>
                <dd>{formatMediumDate(ledger.lastSettledAt, loc)}</dd>
              </div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <dt className="text-prose-muted text-xs">{t("detail.ceiling")}</dt>
                <dd className="tabular-nums">{formatSyp(ledger.creditCeilingSyp, loc)}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {providerId ? (
            <Button size="sm" variant="glass" href={ADMIN_PATHS.business(providerId)}>
              <Building2 className="size-4" aria-hidden />
              {t("detail.openProvider")}
            </Button>
          ) : null}
          {outstanding > 0 ? (
            <Button size="sm" disabled={actionPending} onClick={onRecordSettlement}>
              <Banknote className="size-4" aria-hidden />
              {t("detail.recordSettlement")}
            </Button>
          ) : null}
          {canSuspend ? (
            <Button
              size="sm"
              variant="destructive"
              disabled={actionPending}
              onClick={onSuspend}
            >
              <ShieldOff className="size-4" aria-hidden />
              {t("detail.suspend")}
            </Button>
          ) : null}
          {ledger.standing === "suspended" ? (
            <Button
              size="sm"
              variant="glass"
              disabled={actionPending}
              onClick={onReinstate}
            >
              <RotateCcw className="size-4" aria-hidden />
              {t("detail.reinstate")}
            </Button>
          ) : null}
        </div>
      </div>
    </GlassPanel>
  );
}
