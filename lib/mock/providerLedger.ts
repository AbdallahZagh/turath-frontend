export type ProviderLedgerStanding = "healthy" | "warning" | "grace";
export type ProviderSettlementCadence = "weekly" | "biweekly" | "monthly";
export type ProviderStatementStatus = "paid" | "due" | "overdue";
export type ProviderLedgerEntryType = "commission" | "settlement";

export type ProviderLedgerStatement = {
  id: string;
  periodStart: string;
  periodEnd: string;
  accruedSyp: number;
  paidSyp: number;
  status: ProviderStatementStatus;
};

export type ProviderLedgerEntry = {
  id: string;
  occurredAt: string;
  type: ProviderLedgerEntryType;
  reference: string;
  amountSyp: number;
};

export type ProviderLedgerData = {
  tier: "established";
  cadence: ProviderSettlementCadence;
  accruedCommissionSyp: number;
  paidCommissionSyp: number;
  outstandingCommissionSyp: number;
  creditCeilingSyp: number;
  standing: ProviderLedgerStanding;
  nextStatementAt: string;
  statements: ProviderLedgerStatement[];
  entries: ProviderLedgerEntry[];
};

const PROVIDER_LEDGER: ProviderLedgerData = {
  tier: "established",
  cadence: "biweekly",
  accruedCommissionSyp: 6_200_000,
  paidCommissionSyp: 2_100_000,
  outstandingCommissionSyp: 4_100_000,
  creditCeilingSyp: 5_000_000,
  standing: "warning",
  nextStatementAt: "2026-09-28",
  statements: [
    {
      id: "statement-open",
      periodStart: "2026-09-15",
      periodEnd: "2026-09-28",
      accruedSyp: 1_420_000,
      paidSyp: 0,
      status: "due",
    },
    {
      id: "statement-2026-09-14",
      periodStart: "2026-09-01",
      periodEnd: "2026-09-14",
      accruedSyp: 1_180_000,
      paidSyp: 0,
      status: "overdue",
    },
    {
      id: "statement-2026-08-31",
      periodStart: "2026-08-18",
      periodEnd: "2026-08-31",
      accruedSyp: 1_050_000,
      paidSyp: 1_050_000,
      status: "paid",
    },
    {
      id: "statement-2026-08-17",
      periodStart: "2026-08-04",
      periodEnd: "2026-08-17",
      accruedSyp: 1_050_000,
      paidSyp: 1_050_000,
      status: "paid",
    },
  ],
  entries: [
    {
      id: "entry-01",
      occurredAt: "2026-09-21T11:42:00+03:00",
      type: "commission",
      reference: "TRH-RMD318",
      amountSyp: 28_800,
    },
    {
      id: "entry-02",
      occurredAt: "2026-09-21T10:18:00+03:00",
      type: "commission",
      reference: "TRH-WQS502",
      amountSyp: 50_400,
    },
    {
      id: "entry-03",
      occurredAt: "2026-09-18T15:00:00+03:00",
      type: "settlement",
      reference: "STL-2026-0918",
      amountSyp: 1_050_000,
    },
    {
      id: "entry-04",
      occurredAt: "2026-09-17T16:20:00+03:00",
      type: "commission",
      reference: "TRH-JSA114",
      amountSyp: 57_600,
    },
  ],
};

export function getProviderLedger(): ProviderLedgerData {
  return {
    ...PROVIDER_LEDGER,
    statements: PROVIDER_LEDGER.statements.map((statement) => ({ ...statement })),
    entries: PROVIDER_LEDGER.entries.map((entry) => ({ ...entry })),
  };
}
