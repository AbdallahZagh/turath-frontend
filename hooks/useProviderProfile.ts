import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type { ProviderProfile } from "@/lib/mock/providerProfile";
import type { ProviderCategory } from "@/lib/validation/auth";
import type { ProviderProfileValues } from "@/lib/validation/providerProfile";
import {
  getProviderProfile,
  updateProviderProfile,
} from "@/services/providerProfile";

const providerProfileKey = (category: ProviderCategory) => ["provider", "profile", category] as const;

export function useProviderProfile(category: ProviderCategory): UseQueryResult<ProviderProfile> {
  return useQuery({
    queryKey: providerProfileKey(category),
    queryFn: () => getProviderProfile(category),
    staleTime: 60_000,
  });
}

export function useUpdateProviderProfile(category: ProviderCategory): UseMutationResult<
  ProviderProfile,
  Error,
  ProviderProfileValues
> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (values) => updateProviderProfile(category, values),
    onSuccess: (profile) => {
      client.setQueryData(providerProfileKey(category), profile);
    },
  });
}
