import { addDays } from "date-fns";

import { parseIsoDate, toIsoDate } from "@/lib/format/datetime";
import type { LocalizedName } from "@/lib/i18n/localized";
import type { LandingPillarId } from "@/lib/mock/landing";

export const LEDGER_STANDINGS = ["healthy", "watch", "grace", "suspended"] as const;

export type LedgerStanding = (typeof LEDGER_STANDINGS)[number];

export type SettlementCadence = "weekly" | "biweekly" | "monthly";

export type AdminLedgerRow = {
  id: string;
  provider: LocalizedName;
  category: LandingPillarId;
  accruedSyp: number;
  paidSyp: number;
  creditCeilingSyp: number;
  creditUsed: number;
  cadence: SettlementCadence;
  lastSettledAt: string;
  standing: LedgerStanding;
};

export const CREDIT_WATCH_RATIO = 0.75;
export const CREDIT_GRACE_RATIO = 1;

export type SettlementStatus = "paid" | "due" | "overdue";

export type AdminLedgerStatement = {
  id: string;
  periodStart: string;
  periodEnd: string;
  accruedSyp: number;
  paidSyp: number;
  status: SettlementStatus;
};

const CADENCE_DAYS: Record<SettlementCadence, number> = {
  weekly: 7,
  biweekly: 14,
  monthly: 30,
};

const STATEMENT_HISTORY = 6;

export function outstandingSyp(row: AdminLedgerRow): number {
  return Math.max(row.accruedSyp - row.paidSyp, 0);
}

/** Share of the credit ceiling used by unpaid commission; the admin and business ledgers both use it. */
export function creditUsedRatio(outstanding: number, creditCeilingSyp: number): number {
  return creditCeilingSyp > 0 ? outstanding / creditCeilingSyp : 0;
}

/** PAGES.md credit rules: watch from 75% of the ceiling, 48h grace from 100%. */
export function creditStandingFor(ratio: number): Exclude<LedgerStanding, "suspended"> {
  if (ratio >= CREDIT_GRACE_RATIO) {
    return "grace";
  }
  if (ratio >= CREDIT_WATCH_RATIO) {
    return "watch";
  }
  return "healthy";
}

/** Stored ledger: amounts and a manual suspension only; credit used and standing are derived. */
type StoredLedger = Omit<AdminLedgerRow, "creditUsed" | "standing"> & { suspended?: boolean };

const LEDGER_SEED: StoredLedger[] = [
  {
    id: "ldg_01",
    provider: { en: "Beit Al-Wali", ar: "بيت الوالي" },
    category: "hotels",
    accruedSyp: 4_820_000,
    paidSyp: 3_100_000,
    creditCeilingSyp: 15_000_000,
    cadence: "weekly",
    lastSettledAt: "2026-08-25",
  },
  {
    id: "ldg_02",
    provider: { en: "Umayyad Courtyard Kitchen", ar: "مطبخ صحن الأموي" },
    category: "dining",
    accruedSyp: 1_940_000,
    paidSyp: 1_200_000,
    creditCeilingSyp: 5_000_000,
    cadence: "biweekly",
    lastSettledAt: "2026-08-18",
  },
  {
    id: "ldg_03",
    provider: { en: "Citadel Walks", ar: "مشاوير القلعة" },
    category: "guides",
    accruedSyp: 890_000,
    paidSyp: 210_000,
    creditCeilingSyp: 1_500_000,
    cadence: "monthly",
    lastSettledAt: "2026-08-01",
  },
  {
    id: "ldg_04",
    provider: { en: "Harbor Tables Tartus", ar: "طاولات الميناء — طرطوس" },
    category: "dining",
    accruedSyp: 1_120_000,
    paidSyp: 900_000,
    creditCeilingSyp: 2_500_000,
    cadence: "biweekly",
    lastSettledAt: "2026-08-22",
  },
  {
    id: "ldg_05",
    provider: { en: "Bosra Theatre Nights", ar: "ليالي مسرح بصرى" },
    category: "events",
    accruedSyp: 760_000,
    paidSyp: 760_000,
    creditCeilingSyp: 1_500_000,
    cadence: "monthly",
    lastSettledAt: "2026-08-28",
  },
  {
    id: "ldg_06",
    provider: { en: "Palmyra Dawn Walks", ar: "مشاوير فجر تدمر" },
    category: "trips",
    accruedSyp: 2_640_000,
    paidSyp: 400_000,
    creditCeilingSyp: 2_200_000,
    cadence: "weekly",
    lastSettledAt: "2026-08-04",
  },
  {
    id: "ldg_07",
    provider: { en: "Coastline Guides", ar: "أدلاء الساحل" },
    category: "guides",
    accruedSyp: 1_480_000,
    paidSyp: 200_000,
    creditCeilingSyp: 1_000_000,
    cadence: "monthly",
    lastSettledAt: "2026-07-15",
    suspended: true,
  },
  {
    id: "ldg_08",
    provider: { en: "Orontes Garden Inn", ar: "نزل حديقة العاصي" },
    category: "hotels",
    accruedSyp: 3_210_000,
    paidSyp: 1_800_000,
    creditCeilingSyp: 5_000_000,
    cadence: "weekly",
    lastSettledAt: "2026-08-20",
  },
  {
    id: "ldg_09",
    provider: { en: "Homs Garden Hotel", ar: "فندق حديقة حمص" },
    category: "hotels",
    accruedSyp: 5_100_000,
    paidSyp: 800_000,
    creditCeilingSyp: 4_000_000,
    cadence: "weekly",
    lastSettledAt: "2026-07-28",
    suspended: true,
  },
  {
    id: "ldg_10",
    provider: { en: "Lattakia Dive Club", ar: "نادي غوص اللاذقية" },
    category: "trips",
    accruedSyp: 1_730_000,
    paidSyp: 1_100_000,
    creditCeilingSyp: 1_800_000,
    cadence: "biweekly",
    lastSettledAt: "2026-08-11",
  },
  {
    id: "ldg_11",
    provider: { en: "Krak Night Concert", ar: "حفل ليل الحصن" },
    category: "events",
    accruedSyp: 540_000,
    paidSyp: 120_000,
    creditCeilingSyp: 900_000,
    cadence: "monthly",
    lastSettledAt: "2026-08-02",
  },
  {
    id: "ldg_12",
    provider: { en: "Tartus Harbor Kitchen", ar: "مطبخ ميناء طرطوس" },
    category: "dining",
    accruedSyp: 680_000,
    paidSyp: 680_000,
    creditCeilingSyp: 2_000_000,
    cadence: "biweekly",
    lastSettledAt: "2026-08-29",
  },
];

function toRow({ suspended, ...stored }: StoredLedger): AdminLedgerRow {
  const creditUsed = creditUsedRatio(Math.max(stored.accruedSyp - stored.paidSyp, 0), stored.creditCeilingSyp);
  return {
    ...stored,
    provider: { ...stored.provider },
    creditUsed,
    standing: suspended ? "suspended" : creditStandingFor(creditUsed),
  };
}

const ledgers: StoredLedger[] = LEDGER_SEED.map((row) => ({ ...row, provider: { ...row.provider } }));

export function listAdminLedger(): AdminLedgerRow[] {
  return ledgers.map(toRow);
}

export function getAdminLedger(id: string): AdminLedgerRow | undefined {
  const found = ledgers.find((row) => row.id === id);
  return found ? toRow(found) : undefined;
}

export function getAdminLedgerByProviderName(en: string): AdminLedgerRow | undefined {
  const found = ledgers.find((row) => row.provider.en === en);
  return found ? toRow(found) : undefined;
}

function writeLedger(index: number, next: StoredLedger): AdminLedgerRow {
  ledgers[index] = next;
  return toRow(next);
}

function findIndex(id: string): number {
  const index = ledgers.findIndex((row) => row.id === id);
  if (index === -1) {
    throw new Error(`Unknown admin ledger: ${id}`);
  }
  return index;
}

export function setAdminLedgerStanding(
  id: string,
  standing: Extract<LedgerStanding, "suspended"> | "reinstate",
): AdminLedgerRow {
  const index = findIndex(id);
  const current = ledgers[index];
  if (current === undefined) {
    throw new Error(`Unknown admin ledger: ${id}`);
  }

  return writeLedger(index, { ...current, suspended: standing === "suspended" });
}

export function recordAdminLedgerSettlement(id: string, at: string): AdminLedgerRow {
  const index = findIndex(id);
  const current = ledgers[index];
  if (current === undefined) {
    throw new Error(`Unknown admin ledger: ${id}`);
  }

  return writeLedger(index, { ...current, paidSyp: current.accruedSyp, lastSettledAt: at });
}

function shiftIso(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  if (!date) {
    return iso;
  }
  return toIsoDate(addDays(date, days));
}

function splitAmount(total: number, parts: number): number[] {
  if (parts <= 0) {
    return [];
  }
  if (total <= 0) {
    return Array.from({ length: parts }, () => 0);
  }
  const base = Math.floor(total / parts);
  const remainder = total - base * parts;
  return Array.from({ length: parts }, (_, index) =>
    index === 0 ? base + remainder : base,
  );
}

export function buildLedgerStatements(
  row: AdminLedgerRow,
  today = toIsoDate(new Date()),
): AdminLedgerStatement[] {
  const span = CADENCE_DAYS[row.cadence];
  const paidChunks = splitAmount(row.paidSyp, STATEMENT_HISTORY);
  const statements: AdminLedgerStatement[] = [];
  const outstanding = outstandingSyp(row);

  if (outstanding > 0) {
    const periodStart = shiftIso(row.lastSettledAt, 1);
    const periodEnd = today < periodStart ? periodStart : today;
    const overdueCutoff = shiftIso(today, -(span - 1));
    const overdue =
      row.standing === "grace" ||
      row.standing === "suspended" ||
      periodStart < overdueCutoff;

    statements.push({
      id: `${row.id}_st_open`,
      periodStart,
      periodEnd,
      accruedSyp: outstanding,
      paidSyp: 0,
      status: overdue ? "overdue" : "due",
    });
  }

  for (let index = 0; index < STATEMENT_HISTORY; index += 1) {
    const periodEnd = shiftIso(row.lastSettledAt, -index * span);
    const periodStart = shiftIso(periodEnd, -(span - 1));
    const amount = paidChunks[index] ?? 0;
    statements.push({
      id: `${row.id}_st_${periodEnd}`,
      periodStart,
      periodEnd,
      accruedSyp: amount,
      paidSyp: amount,
      status: "paid",
    });
  }

  return statements;
}
