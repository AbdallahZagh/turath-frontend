import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type { AdminLedgerRow, LedgerStanding } from "@/lib/mock/adminLedger";
import {
  getAdminLedgerDetail,
  listAdminLedger,
  recordAdminLedgerSettlement,
  setAdminLedgerStanding,
  type AdminLedgerDetailData,
} from "@/services/adminLedger";

const adminLedgerQueryKey = ["admin", "ledger"] as const;

function adminLedgerDetailQueryKey(
  id: string,
): readonly ["admin", "ledger", string] {
  return ["admin", "ledger", id] as const;
}

export function useAdminLedger(): UseQueryResult<AdminLedgerRow[]> {
  return useQuery({
    queryKey: adminLedgerQueryKey,
    queryFn: listAdminLedger,
  });
}

export function useAdminLedgerDetail(
  id: string,
): UseQueryResult<AdminLedgerDetailData | null> {
  return useQuery({
    queryKey: adminLedgerDetailQueryKey(id),
    queryFn: () => getAdminLedgerDetail(id),
  });
}

function syncLedgerCaches(
  client: ReturnType<typeof useQueryClient>,
  row: AdminLedgerRow,
): void {
  client.setQueryData<AdminLedgerRow[]>(adminLedgerQueryKey, (current) =>
    current?.map((item) => (item.id === row.id ? row : item)),
  );
  void client.invalidateQueries({ queryKey: adminLedgerDetailQueryKey(row.id) });
  void client.invalidateQueries({ queryKey: ["admin", "providers"] });
}

type StandingInput = {
  id: string;
  standing: Extract<LedgerStanding, "suspended"> | "reinstate";
};

export function useSetAdminLedgerStanding(): UseMutationResult<
  AdminLedgerRow,
  Error,
  StandingInput
> {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, standing }) => setAdminLedgerStanding(id, standing),
    onSuccess: (row) => {
      syncLedgerCaches(client, row);
    },
  });
}

export function useRecordAdminLedgerSettlement(): UseMutationResult<
  AdminLedgerRow,
  Error,
  string
> {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id) => recordAdminLedgerSettlement(id),
    onSuccess: (row) => {
      syncLedgerCaches(client, row);
    },
  });
}
