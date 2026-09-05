"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CircleCheck, Scale, Wallet } from "lucide-react";

import { KpiCard } from "@/components/admin/OverviewPrimitives";
import { creditBarClass, creditUsedClass } from "@/components/admin/ledgerStanding";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { formatSyp } from "@/lib/format/money";
import { formatPercent } from "@/lib/format/number";
import { outstandingSyp, type AdminLedgerRow } from "@/lib/mock/adminLedger";

type AdminLedgerBalanceProps = {
  ledger: AdminLedgerRow;
};

export function AdminLedgerBalance({ ledger }: AdminLedgerBalanceProps): ReactNode {
  const t = useTranslations("admin.ledger");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const outstanding = outstandingSyp(ledger);
  const barWidth = Math.min(Math.max(ledger.creditUsed, 0) * 100, 100);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          icon={Scale}
          label={t("columns.outstanding")}
          value={formatSyp(outstanding, loc)}
        />
        <KpiCard
          icon={Wallet}
          label={t("columns.accrued")}
          value={formatSyp(ledger.accruedSyp, loc)}
        />
        <KpiCard
          icon={CircleCheck}
          label={t("detail.paid")}
          value={formatSyp(ledger.paidSyp, loc)}
        />
      </div>
      <GlassPanel className="flex-none gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-prose text-lg font-semibold">{t("detail.creditTitle")}</h2>
            <p className="text-prose-muted text-sm leading-relaxed">
              {t(`detail.hint.${ledger.standing}`)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span
              className={cn(
                "font-heading text-2xl font-semibold tabular-nums tracking-tight",
                creditUsedClass(ledger.creditUsed),
              )}
            >
              {formatPercent(ledger.creditUsed, loc, 0)}
            </span>
            <span className="text-prose-muted text-xs tabular-nums">
              {t("detail.creditOf", { ceiling: formatSyp(ledger.creditCeilingSyp, loc) })}
            </span>
          </div>
        </div>
        <div className="bg-glass-control h-2 overflow-hidden rounded-full">
          <div
            className={cn("h-full rounded-full", creditBarClass(ledger.creditUsed))}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </GlassPanel>
    </div>
  );
}
