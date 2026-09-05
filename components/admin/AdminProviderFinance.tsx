"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";

import { ADMIN_PATHS } from "@/config/adminRoutes";
import { ledgerStandingBadgeProps } from "@/components/admin/ledgerStanding";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { useSaveAdminProviderFinance } from "@/hooks/useAdminProviders";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { formatMediumDate } from "@/lib/format/datetime";
import { formatSyp } from "@/lib/format/money";
import { formatPercent } from "@/lib/format/number";
import type { AdminLedgerRow } from "@/lib/mock/adminLedger";
import type { AdminProvider } from "@/lib/mock/adminProviders";
import { toast } from "@/store/toastStore";

type AdminProviderFinanceProps = {
  provider: AdminProvider;
  ledger: AdminLedgerRow | null;
  pillarRate: number;
  tierCeilingSyp: number;
};

function rateToInput(rate: number | null): string {
  if (rate === null) {
    return "";
  }
  const percent = rate * 100;
  return Number.isInteger(percent) ? String(percent) : percent.toFixed(1);
}

function parsePercent(value: string): number | undefined {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
    return undefined;
  }
  return parsed / 100;
}

export function AdminProviderFinance({
  provider,
  ledger,
  pillarRate,
  tierCeilingSyp,
}: AdminProviderFinanceProps): ReactNode {
  const t = useTranslations("admin.providers");
  const tLedger = useTranslations("admin.ledger");
  const tTiers = useTranslations("admin.commissions");
  const tUi = useTranslations("ui");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const saveFinance = useSaveAdminProviderFinance();

  const [source, setSource] = useState(provider);
  const [commission, setCommission] = useState(() => rateToInput(provider.commissionOverride));
  const [credit, setCredit] = useState(() =>
    provider.creditOverrideSyp === null ? "" : String(provider.creditOverrideSyp),
  );

  if (provider !== source) {
    setSource(provider);
    setCommission(rateToInput(provider.commissionOverride));
    setCredit(provider.creditOverrideSyp === null ? "" : String(provider.creditOverrideSyp));
  }

  const effectiveRate = provider.commissionOverride ?? pillarRate;
  const effectiveCeiling = provider.creditOverrideSyp ?? tierCeilingSyp;
  const outstanding = ledger ? ledger.accruedSyp - ledger.paidSyp : 0;

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const trimmedRate = commission.trim();
    const trimmedCredit = credit.trim();
    let commissionOverride: number | null = null;
    let creditOverrideSyp: number | null = null;

    if (trimmedRate !== "") {
      const parsed = parsePercent(trimmedRate);
      if (parsed === undefined) {
        toast.error(t("detail.financeInvalid"));
        return;
      }
      commissionOverride = parsed;
    }

    if (trimmedCredit !== "") {
      const amount = Number(trimmedCredit);
      if (!Number.isFinite(amount) || amount <= 0) {
        toast.error(t("detail.financeInvalid"));
        return;
      }
      creditOverrideSyp = Math.round(amount);
    }

    saveFinance.mutate(
      { id: provider.id, finance: { commissionOverride, creditOverrideSyp } },
      {
        onSuccess: () => {
          toast.success(t("detail.financeSaved"), t("detail.financeSavedBody"));
        },
        onError: () => {
          toast.error(tUi("errorTitle"), tUi("errorDescription"));
        },
      },
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <GlassPanel className="flex-none gap-4 p-5 sm:p-6">
        <h2 className="text-prose text-lg font-semibold">{t("detail.financeTitle")}</h2>
        <p className="text-prose-muted text-sm">
          {t("detail.tier")}: {tTiers(`tiers.${provider.tier}`)}
        </p>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <label className="flex flex-col gap-1.5">
            <span className="text-prose-muted text-xs font-medium">{t("detail.commission")}</span>
            <div className="flex items-center gap-2">
              <Input
                variant="glass"
                size="sm"
                type="number"
                min={0}
                max={100}
                step={0.1}
                inputMode="decimal"
                value={commission}
                onChange={(event) => setCommission(event.target.value)}
                label={t("detail.commission")}
                className="w-28"
              />
              <span className="text-prose-muted text-sm">%</span>
            </div>
            <span className="text-prose-muted text-xs">
              {t("detail.commissionHint")}{" "}
              {t("detail.commissionDefault", { rate: formatPercent(pillarRate, loc, 1) })}
            </span>
            <span className="text-prose text-xs tabular-nums">
              {formatPercent(effectiveRate, loc, 1)}
            </span>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-prose-muted text-xs font-medium">{t("detail.creditCeiling")}</span>
            <Input
              variant="glass"
              size="sm"
              type="number"
              min={1}
              step={1000}
              inputMode="numeric"
              value={credit}
              onChange={(event) => setCredit(event.target.value)}
              label={t("detail.creditCeiling")}
            />
            <span className="text-prose-muted text-xs">
              {t("detail.creditHint")}{" "}
              {t("detail.creditDefault", { amount: formatSyp(tierCeilingSyp, loc) })}
            </span>
            <span className="text-prose text-xs tabular-nums">{formatSyp(effectiveCeiling, loc)}</span>
          </label>
          <div>
            <Button type="submit" size="sm" disabled={saveFinance.isPending}>
              {t("detail.saveFinance")}
            </Button>
          </div>
        </form>
      </GlassPanel>

      <GlassPanel className="flex-none gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-prose text-lg font-semibold">{t("detail.ledgerTitle")}</h2>
          {ledger ? (
            <Button size="sm" variant="glass" href={ADMIN_PATHS.account(ledger.id)}>
              {tLedger("detail.openLedger")}
            </Button>
          ) : null}
        </div>
        {ledger ? (
          <dl className="grid gap-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-prose-muted">{tLedger("columns.standing")}</dt>
              <dd>
                <Badge {...ledgerStandingBadgeProps(ledger.standing)}>
                  {tLedger(`standing.${ledger.standing}`)}
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-prose-muted">{t("detail.accrued")}</dt>
              <dd className="tabular-nums">{formatSyp(ledger.accruedSyp, loc)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-prose-muted">{t("detail.paid")}</dt>
              <dd className="tabular-nums">{formatSyp(ledger.paidSyp, loc)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-prose-muted">{t("detail.outstanding")}</dt>
              <dd className="font-medium tabular-nums">{formatSyp(outstanding, loc)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-prose-muted">{t("detail.creditUsed")}</dt>
              <dd
                className={cn(
                  "font-medium tabular-nums",
                  ledger.creditUsed >= 1
                    ? "text-destructive"
                    : ledger.creditUsed >= 0.75
                      ? "text-accent"
                      : "text-prose",
                )}
              >
                {formatPercent(ledger.creditUsed, loc, 0)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-prose-muted">{tLedger("columns.cadence")}</dt>
              <dd>{tLedger(`cadence.${ledger.cadence}`)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-prose-muted">{t("detail.lastSettled")}</dt>
              <dd>{formatMediumDate(ledger.lastSettledAt, loc)}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-prose-muted text-sm leading-relaxed">{t("detail.ledgerEmpty")}</p>
        )}
      </GlassPanel>
    </div>
  );
}
