import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type { ProviderProfile } from "@/lib/mock/providerProfile";
import type { ProviderProfileValues } from "@/lib/validation/providerProfile";
import {
  getProviderProfile,
  updateProviderProfile,
} from "@/services/providerProfile";

const providerProfileKey = ["provider", "profile"] as const;

export function useProviderProfile(): UseQueryResult<ProviderProfile> {
  return useQuery({
    queryKey: providerProfileKey,
    queryFn: getProviderProfile,
    staleTime: 60_000,
  });
}

export function useUpdateProviderProfile(): UseMutationResult<
  ProviderProfile,
  Error,
  ProviderProfileValues
> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: updateProviderProfile,
    onSuccess: (profile) => {
      client.setQueryData(providerProfileKey, profile);
    },
  });
}
