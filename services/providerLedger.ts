import {
  getProviderLedger as getProviderLedgerMock,
  type ProviderLedgerData,
} from "@/lib/mock/providerLedger";

export async function getProviderLedger(): Promise<ProviderLedgerData> {
  return getProviderLedgerMock();
}
