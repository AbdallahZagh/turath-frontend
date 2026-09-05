"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";

import { ADMIN_TOOLBAR_HEIGHT } from "@/components/admin/AdminFilterBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input } from "@/components/ui/Input";
import { Table, type TableColumn } from "@/components/ui/Table";
import {
  useAdminCommissions,
  useSaveAdminCommissions,
} from "@/hooks/useAdminCommissions";
import type { Locale } from "@/i18n/config";
import { formatPercent } from "@/lib/format/number";
import {
  COMMISSION_PILLARS,
  COMMISSION_TIER_RATES,
  COMMISSION_TIERS,
  type AdminCommissionRow,
} from "@/lib/mock/adminCommissions";
import type { LandingPillarId } from "@/lib/mock/landing";
import { toast } from "@/store/toastStore";

type RateDraft = Record<LandingPillarId, string>;

function rateToInput(rate: number): string {
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

function ratesFromData(data: { rows: AdminCommissionRow[] }): RateDraft {
  return Object.fromEntries(
    data.rows.map((row) => [row.category, rateToInput(row.rate)]),
  ) as RateDraft;
}

export function AdminCommissions(): ReactNode {
  const t = useTranslations("admin.commissions");
  const tPillars = useTranslations("admin.overview.pillars");
  const tUi = useTranslations("ui");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const { data, isPending, isError, refetch } = useAdminCommissions();
  const saveRates = useSaveAdminCommissions();

  const [source, setSource] = useState(data);
  const [sypPerUsd, setSypPerUsd] = useState(() =>
    data ? String(data.sypPerUsd) : "",
  );
  const [rates, setRates] = useState<RateDraft | null>(() =>
    data ? ratesFromData(data) : null,
  );

  if (data !== source) {
    setSource(data);
    if (data) {
      setSypPerUsd(String(data.sypPerUsd));
      setRates(ratesFromData(data));
    }
  }

  const rows = useMemo((): AdminCommissionRow[] => {
    if (!data) {
      return [];
    }
    return COMMISSION_PILLARS.map((category) => {
      const match = data.rows.find((row) => row.category === category);
      return match ?? { category, rate: 0 };
    });
  }, [data]);

  const columns: TableColumn<AdminCommissionRow>[] = [
    {
      id: "category",
      header: t("columns.category"),
      cell: (row) => <span className="font-medium">{tPillars(row.category)}</span>,
    },
    {
      id: "rate",
      header: t("columns.rate"),
      align: "end",
      cell: (row) => (
        <div className="ms-auto flex w-28 items-center gap-2">
          <Input
            variant="glass"
            size="sm"
            type="number"
            min={0}
            max={100}
            step={0.1}
            inputMode="decimal"
            value={rates?.[row.category] ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              setRates((current) =>
                current ? { ...current, [row.category]: value } : current,
              );
            }}
            label={t("columns.rate")}
          />
          <span className="text-prose-muted text-sm">%</span>
        </div>
      ),
    },
  ];

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!rates) {
      return;
    }

    const exchange = Number(sypPerUsd);
    const parsedRates = {} as Record<LandingPillarId, number>;
    for (const pillar of COMMISSION_PILLARS) {
      const rate = parsePercent(rates[pillar] ?? "");
      if (rate === undefined) {
        toast.error(t("saveFailed"), t("invalid"));
        return;
      }
      parsedRates[pillar] = rate;
    }
    if (!Number.isFinite(exchange) || exchange <= 0) {
      toast.error(t("saveFailed"), t("invalid"));
      return;
    }

    saveRates.mutate(
      { sypPerUsd: Math.round(exchange), rates: parsedRates },
      {
        onSuccess: () => {
          toast.success(t("saved"), t("savedBody"));
        },
        onError: () => {
          toast.error(t("saveFailed"), t("saveFailedBody"));
        },
      },
    );
  }

  if (isError) {
    return (
      <ErrorState
        className="flex-1 justify-center"
        title={tUi("errorTitle")}
        description={tUi("errorDescription")}
        retryLabel={tUi("retry")}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <form className="flex min-h-0 flex-1 flex-col gap-4" onSubmit={onSubmit}>
      <div className="flex shrink-0 flex-col gap-2">
        <div className="flex flex-wrap items-stretch gap-2">
          <Input
            variant="glass"
            size="sm"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            value={sypPerUsd}
            onChange={(event) => setSypPerUsd(event.target.value)}
            placeholder={t("rateLabel")}
            label={t("rateLabel")}
            minHeight={ADMIN_TOOLBAR_HEIGHT}
            className="w-full sm:max-w-sm"
          />
          <Button
            type="submit"
            size="sm"
            minHeight={ADMIN_TOOLBAR_HEIGHT}
            disabled={saveRates.isPending || !rates}
          >
            {t("save")}
          </Button>
        </div>
        <ul className="flex flex-wrap items-center gap-2">
          {COMMISSION_TIERS.map((tier) => (
            <li key={tier}>
              <Badge variant={tier === "standard" ? "solid" : "glass"}>
                {t(`tiers.${tier}`)} · {formatPercent(COMMISSION_TIER_RATES[tier], loc, 1)}
              </Badge>
            </li>
          ))}
        </ul>
        <p className="text-prose-muted text-xs">{t("tierHint")}</p>
      </div>
      <Table
        fill
        columns={columns}
        rows={rows}
        getRowId={(row) => row.category}
        caption={t("caption")}
        emptyMessage={t("caption")}
        isLoading={isPending || !rates}
        loadingRowCount={COMMISSION_PILLARS.length}
      />
    </form>
  );
}
