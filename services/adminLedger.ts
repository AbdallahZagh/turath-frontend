import { toIsoDate } from "@/lib/format/datetime";
import {
  buildLedgerStatements,
  getAdminLedger as readAdminLedger,
  listAdminLedger as readAdminLedgerList,
  recordAdminLedgerSettlement as writeAdminLedgerSettlement,
  setAdminLedgerStanding as writeAdminLedgerStanding,
  type AdminLedgerRow,
  type AdminLedgerStatement,
  type LedgerStanding,
} from "@/lib/mock/adminLedger";
import { findAdminProviderIdByName } from "@/lib/mock/adminProviders";

export type AdminLedgerDetailData = {
  ledger: AdminLedgerRow;
  statements: AdminLedgerStatement[];
  providerId: string | null;
};

export async function listAdminLedger(): Promise<AdminLedgerRow[]> {
  return readAdminLedgerList();
}

export async function getAdminLedgerDetail(
  id: string,
): Promise<AdminLedgerDetailData | null> {
  const ledger = readAdminLedger(id);
  if (!ledger) {
    return null;
  }

  return {
    ledger,
    statements: buildLedgerStatements(ledger),
    providerId: findAdminProviderIdByName(ledger.provider.en) ?? null,
  };
}

export async function setAdminLedgerStanding(
  id: string,
  standing: Extract<LedgerStanding, "suspended"> | "reinstate",
): Promise<AdminLedgerRow> {
  return writeAdminLedgerStanding(id, standing);
}

export async function recordAdminLedgerSettlement(id: string): Promise<AdminLedgerRow> {
  return writeAdminLedgerSettlement(id, toIsoDate(new Date()));
}
