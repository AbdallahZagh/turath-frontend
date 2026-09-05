import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type { LocalizedName } from "@/lib/i18n/localized";
import type { AdminDispute, DisputeResolution } from "@/lib/mock/adminDisputes";
import {
  getAdminDisputeDetail,
  listAdminDisputes,
  resolveAdminDispute,
  type AdminDisputeDetailData,
} from "@/services/adminDisputes";

const adminDisputesQueryKey = ["admin", "disputes"] as const;

function adminDisputeQueryKey(
  id: string,
): readonly ["admin", "disputes", string] {
  return ["admin", "disputes", id] as const;
}

export function useAdminDisputes(): UseQueryResult<AdminDispute[]> {
  return useQuery({
    queryKey: adminDisputesQueryKey,
    queryFn: listAdminDisputes,
  });
}

export function useAdminDispute(
  id: string,
): UseQueryResult<AdminDisputeDetailData | null> {
  return useQuery({
    queryKey: adminDisputeQueryKey(id),
    queryFn: () => getAdminDisputeDetail(id),
  });
}

type ResolveInput = {
  id: string;
  status: DisputeResolution;
  notes: LocalizedName;
};

export function useResolveAdminDispute(): UseMutationResult<
  AdminDispute,
  Error,
  ResolveInput
> {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, notes }) => resolveAdminDispute(id, status, notes),
    onSuccess: (dispute) => {
      client.setQueryData<AdminDispute[]>(adminDisputesQueryKey, (current) =>
        current?.map((row) => (row.id === dispute.id ? dispute : row)),
      );
      void client.invalidateQueries({ queryKey: adminDisputeQueryKey(dispute.id) });
    },
  });
}
