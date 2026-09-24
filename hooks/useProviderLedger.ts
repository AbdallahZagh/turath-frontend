import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { ProviderLedgerData } from "@/lib/mock/providerLedger";
import { getProviderLedger } from "@/services/providerLedger";

const providerLedgerQueryKey = ["provider", "ledger"] as const;

export function useProviderLedger(): UseQueryResult<ProviderLedgerData> {
  return useQuery({
    queryKey: providerLedgerQueryKey,
    queryFn: getProviderLedger,
    staleTime: 60_000,
  });
}
