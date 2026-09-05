"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";

import { settlementStatusBadgeProps } from "@/components/admin/settlementStatus";
import { Badge } from "@/components/ui/Badge";
import { Table, type TableColumn } from "@/components/ui/Table";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import { formatSyp } from "@/lib/format/money";
import type { AdminLedgerStatement } from "@/lib/mock/adminLedger";

type AdminLedgerStatementsProps = {
  statements: AdminLedgerStatement[];
};

export function AdminLedgerStatements({
  statements,
}: AdminLedgerStatementsProps): ReactNode {
  const t = useTranslations("admin.ledger");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";

  const columns: TableColumn<AdminLedgerStatement>[] = [
    {
      id: "period",
      header: t("detail.period"),
      cell: (row) => (
        <span className="whitespace-nowrap">
          {formatMediumDate(row.periodStart, loc)}
          {" – "}
          {formatMediumDate(row.periodEnd, loc)}
        </span>
      ),
    },
    {
      id: "accrued",
      header: t("columns.accrued"),
      align: "end",
      cell: (row) => (
        <span className="tabular-nums whitespace-nowrap">
          {formatSyp(row.accruedSyp, loc)}
        </span>
      ),
    },
    {
      id: "paid",
      header: t("detail.paid"),
      align: "end",
      cell: (row) => (
        <span className="tabular-nums whitespace-nowrap">{formatSyp(row.paidSyp, loc)}</span>
      ),
    },
    {
      id: "status",
      header: t("detail.status"),
      cell: (row) => (
        <Badge {...settlementStatusBadgeProps(row.status)}>
          {t(`detail.statementStatus.${row.status}`)}
        </Badge>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-prose text-lg font-semibold">{t("detail.statementsTitle")}</h2>
      <Table
        columns={columns}
        rows={statements}
        getRowId={(row) => row.id}
        caption={t("detail.statementsTitle")}
        emptyMessage={t("detail.statementsEmpty")}
      />
    </section>
  );
}
