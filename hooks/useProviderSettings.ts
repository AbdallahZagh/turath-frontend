import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type { ProviderSettings } from "@/lib/mock/providerSettings";
import type { ProviderSettingsValues } from "@/lib/validation/providerSettings";
import {
  getProviderSettings,
  updateProviderSettings,
} from "@/services/providerSettings";

const providerSettingsKey = ["provider", "settings"] as const;

export function useProviderSettings(): UseQueryResult<ProviderSettings> {
  return useQuery({
    queryKey: providerSettingsKey,
    queryFn: getProviderSettings,
    staleTime: 60_000,
  });
}

export function useUpdateProviderSettings(): UseMutationResult<
  ProviderSettings,
  Error,
  ProviderSettingsValues
> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: updateProviderSettings,
    onSuccess: (settings) => {
      client.setQueryData(providerSettingsKey, settings);
    },
  });
}
