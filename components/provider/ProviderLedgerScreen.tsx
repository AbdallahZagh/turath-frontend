"use client";

import {
  AlertTriangle,
  CalendarClock,
  CircleCheck,
  Inbox,
  ReceiptText,
  ShieldLock,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { Table, type TableColumn } from "@/components/ui/Table";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import { useProviderLedger } from "@/hooks/useProviderLedger";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { formatMediumDate } from "@/lib/format/datetime";
import { formatPercent } from "@/lib/format/number";
import type {
  ProviderLedgerEntry,
  ProviderLedgerStatement,
  ProviderLedgerStanding,
  ProviderStatementStatus,
} from "@/lib/mock/providerLedger";
import { useAuthStore } from "@/store/authStore";

type SummaryCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
};

function SummaryCard({ icon: Icon, label, value, hint }: SummaryCardProps): ReactNode {
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

function statementBadge(status: ProviderStatementStatus): {
  variant: "solid" | "glass" | "outline";
  className?: string;
} {
  if (status === "paid") {
    return { variant: "solid" };
  }
  if (status === "due") {
    return { variant: "glass", className: "text-accent" };
  }
  return { variant: "outline", className: "border-destructive text-destructive" };
}

function standingClasses(standing: ProviderLedgerStanding): {
  icon: string;
  bar: string;
  panel: string;
} {
  if (standing === "grace") {
    return {
      icon: "text-destructive",
      bar: "bg-destructive",
      panel: "border-destructive/40",
    };
  }
  if (standing === "warning") {
    return {
      icon: "text-accent",
      bar: "bg-accent",
      panel: "border-accent/40",
    };
  }
  return { icon: "text-primary", bar: "bg-primary", panel: "" };
}

function LedgerSkeleton(): ReactNode {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-36" />
        ))}
      </div>
      <Skeleton className="h-56" />
      <Skeleton className="h-80" />
      <Skeleton className="h-72" />
    </div>
  );
}

export function ProviderLedgerScreen(): ReactNode {
  const t = useTranslations("provider.ledger");
  const tUi = useTranslations("ui");
  const rawLocale = useLocale();
  const locale: Locale = rawLocale === "ar" ? "ar" : "en";
  const formatMoney = useFormatSyp();
  const role = useAuthStore((state) => state.user.role);
  const query = useProviderLedger();

  if (role !== "PROVIDER_OWNER") {
    return (
      <EmptyState
        icon={ShieldLock}
        title={t("ownerOnly.title")}
        description={t("ownerOnly.description")}
      />
    );
  }

  if (query.isPending) {
    return <LedgerSkeleton />;
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
        title={t("empty.title")}
        description={t("empty.description")}
      />
    );
  }

  const ledger = query.data;
  const creditUsed =
    ledger.creditCeilingSyp > 0
      ? ledger.outstandingCommissionSyp / ledger.creditCeilingSyp
      : 0;
  const usageWidth = Math.min(Math.max(creditUsed, 0) * 100, 100);
  const standing = standingClasses(ledger.standing);

  const statementColumns: TableColumn<ProviderLedgerStatement>[] = [
    {
      id: "period",
      header: t("statements.period"),
      cell: (statement) => (
        <span className="whitespace-nowrap">
          {formatMediumDate(statement.periodStart, locale)}
          {" – "}
          {formatMediumDate(statement.periodEnd, locale)}
        </span>
      ),
    },
    {
      id: "accrued",
      header: t("summary.accrued"),
      align: "end",
      cell: (statement) => (
        <span className="whitespace-nowrap tabular-nums">
          {formatMoney(statement.accruedSyp)}
        </span>
      ),
    },
    {
      id: "paid",
      header: t("summary.paid"),
      align: "end",
      cell: (statement) => (
        <span className="whitespace-nowrap tabular-nums">
          {formatMoney(statement.paidSyp)}
        </span>
      ),
    },
    {
      id: "status",
      header: t("statements.statusLabel"),
      cell: (statement) => (
        <Badge {...statementBadge(statement.status)}>
          {t(`statements.status.${statement.status}`)}
        </Badge>
      ),
    },
  ];

  const activityColumns: TableColumn<ProviderLedgerEntry>[] = [
    {
      id: "date",
      header: t("activity.date"),
      cell: (entry) => (
        <span className="whitespace-nowrap">
          {formatMediumDate(entry.occurredAt, locale)}
        </span>
      ),
    },
    {
      id: "type",
      header: t("activity.typeLabel"),
      cell: (entry) => (
        <Badge variant={entry.type === "settlement" ? "solid" : "glass"}>
          {t(`activity.type.${entry.type}`)}
        </Badge>
      ),
    },
    {
      id: "reference",
      header: t("activity.reference"),
      cell: (entry) => <span className="font-medium">{entry.reference}</span>,
    },
    {
      id: "amount",
      header: t("activity.amount"),
      align: "end",
      cell: (entry) => (
        <span
          className={cn(
            "whitespace-nowrap font-semibold tabular-nums",
            entry.type === "settlement" ? "text-primary" : "text-prose",
          )}
        >
          <bdi>{entry.type === "settlement" ? "−" : "+"}{formatMoney(entry.amountSyp)}</bdi>
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={ReceiptText}
          label={t("summary.accrued")}
          value={formatMoney(ledger.accruedCommissionSyp)}
          hint={t("summary.accruedHint")}
        />
        <SummaryCard
          icon={CircleCheck}
          label={t("summary.paid")}
          value={formatMoney(ledger.paidCommissionSyp)}
          hint={t("summary.paidHint")}
        />
        <SummaryCard
          icon={Wallet}
          label={t("summary.outstanding")}
          value={formatMoney(ledger.outstandingCommissionSyp)}
          hint={t("summary.outstandingHint")}
        />
      </div>

      <GlassPanel className={cn("p-5 sm:p-6", standing.panel)}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-2xl items-start gap-3">
            <span className="bg-option-hover grid size-10 shrink-0 place-items-center rounded-full">
              <AlertTriangle className={cn("size-5", standing.icon)} aria-hidden />
            </span>
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-[0.14em]">
                {t("credit.eyebrow")}
              </p>
              <h2 className="font-heading text-prose mt-1 text-xl font-semibold">
                {t(`credit.state.${ledger.standing}.title`)}
              </h2>
              <p className="text-prose-muted mt-2 text-sm leading-7">
                {t(`credit.state.${ledger.standing}.description`)}
              </p>
            </div>
          </div>
          <div className="shrink-0 lg:text-end">
            <p className={cn("font-heading text-3xl font-semibold tabular-nums", standing.icon)}>
              {formatPercent(creditUsed, locale, 0)}
            </p>
            <p className="text-prose-muted mt-1 text-xs">
              {t("credit.of", { amount: formatMoney(ledger.creditCeilingSyp) })}
            </p>
          </div>
        </div>
        <div className="bg-glass-control mt-5 h-2.5 overflow-hidden rounded-full">
          <div
            className={cn("h-full rounded-full", standing.bar)}
            style={{ width: `${usageWidth}%` }}
          />
        </div>
        <div className="border-border mt-5 grid gap-4 border-t pt-5 sm:grid-cols-3">
          <div>
            <p className="text-prose-muted text-xs uppercase tracking-wide">{t("credit.tier")}</p>
            <p className="text-prose mt-1 text-sm font-semibold">{t(`tier.${ledger.tier}`)}</p>
          </div>
          <div>
            <p className="text-prose-muted text-xs uppercase tracking-wide">{t("credit.cadence")}</p>
            <p className="text-prose mt-1 text-sm font-semibold">{t(`cadence.${ledger.cadence}`)}</p>
          </div>
          <div>
            <p className="text-prose-muted text-xs uppercase tracking-wide">{t("credit.nextStatement")}</p>
            <p className="text-prose mt-1 text-sm font-semibold">
              {formatMediumDate(ledger.nextStatementAt, locale)}
            </p>
          </div>
        </div>
      </GlassPanel>

      <section className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <CalendarClock className="text-primary mt-0.5 size-5" aria-hidden />
          <div>
            <h2 className="font-heading text-prose text-xl font-semibold">{t("statements.title")}</h2>
            <p className="text-prose-muted mt-1 text-sm">{t("statements.description")}</p>
          </div>
        </div>
        <Table
          columns={statementColumns}
          rows={ledger.statements}
          getRowId={(statement) => statement.id}
          caption={t("statements.title")}
          emptyMessage={t("statements.empty")}
        />
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-heading text-prose text-xl font-semibold">{t("activity.title")}</h2>
          <p className="text-prose-muted mt-1 text-sm">{t("activity.description")}</p>
        </div>
        <Table
          columns={activityColumns}
          rows={ledger.entries}
          getRowId={(entry) => entry.id}
          caption={t("activity.title")}
          emptyMessage={t("activity.empty")}
        />
      </section>
    </div>
  );
}
