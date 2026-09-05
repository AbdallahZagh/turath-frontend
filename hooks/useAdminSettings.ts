import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type { AdminSettings } from "@/lib/mock/adminSettings";
import { listAdminSettings, updateAdminSettings } from "@/services/adminSettings";

const adminSettingsQueryKey = ["admin", "settings"] as const;

export function useAdminSettings(): UseQueryResult<AdminSettings> {
  return useQuery({
    queryKey: adminSettingsQueryKey,
    queryFn: listAdminSettings,
  });
}

export function useSaveAdminSettings(): UseMutationResult<
  AdminSettings,
  Error,
  AdminSettings
> {
  const client = useQueryClient();

  return useMutation({
    mutationFn: updateAdminSettings,
    onSuccess: (next) => {
      client.setQueryData(adminSettingsQueryKey, next);
    },
  });
}
