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
  getSignedInProviderProfile,
  updateProviderProfile,
} from "@/services/providerProfile";
import { useAuthStore } from "@/store/authStore";

const providerProfileKey = (category: ProviderCategory) => ["provider", "profile", category] as const;

export function useProviderProfile(category: ProviderCategory): UseQueryResult<ProviderProfile> {
  return useQuery({
    queryKey: providerProfileKey(category),
    queryFn: () => getProviderProfile(category),
    staleTime: 60_000,
  });
}

/** The signed-in business's profile, the source of truth for its category. */
export function useSignedInProviderProfile(): UseQueryResult<ProviderProfile> {
  const accountId = useAuthStore((state) => state.user.id);
  return useQuery({
    queryKey: ["provider", "profile", "signedIn", accountId],
    queryFn: () => getSignedInProviderProfile(accountId),
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
