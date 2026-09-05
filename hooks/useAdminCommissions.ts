import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type {
  AdminCommissions,
  SaveAdminCommissionsInput,
} from "@/lib/mock/adminCommissions";
import {
  listAdminCommissions,
  updateAdminCommissions,
} from "@/services/adminCommissions";

const adminCommissionsQueryKey = ["admin", "commissions"] as const;

export function useAdminCommissions(): UseQueryResult<AdminCommissions> {
  return useQuery({
    queryKey: adminCommissionsQueryKey,
    queryFn: listAdminCommissions,
  });
}

export function useSaveAdminCommissions(): UseMutationResult<
  AdminCommissions,
  Error,
  SaveAdminCommissionsInput
> {
  const client = useQueryClient();

  return useMutation({
    mutationFn: updateAdminCommissions,
    onSuccess: (next) => {
      client.setQueryData(adminCommissionsQueryKey, next);
    },
  });
}
