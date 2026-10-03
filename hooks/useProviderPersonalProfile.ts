import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type {
  ProviderAccount,
  ProviderOwnerPersonalProfile,
  ProviderPersonalProfile,
} from "@/lib/mock/providerPersonalProfile";
import type { ProviderPersonalProfileValues } from "@/lib/validation/providerPersonalProfile";
import {
  getProviderPersonalProfile,
  updateProviderPersonalProfile,
} from "@/services/providerPersonalProfile";

/** One cache entry per signed-in account, so switching accounts never shows the previous person. */
function providerPersonalProfileKey(account: ProviderAccount): readonly string[] {
  return ["provider", "personal-profile", account.role, account.id] as const;
}

export function useProviderPersonalProfile(
  account: ProviderAccount,
): UseQueryResult<ProviderPersonalProfile> {
  return useQuery({
    queryKey: providerPersonalProfileKey(account),
    queryFn: () => getProviderPersonalProfile(account),
    staleTime: 60_000,
  });
}

export function useUpdateProviderPersonalProfile(): UseMutationResult<
  ProviderOwnerPersonalProfile,
  Error,
  { account: ProviderAccount; values: ProviderPersonalProfileValues }
> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: updateProviderPersonalProfile,
    onSuccess: (profile, { account }) => {
      client.setQueryData(providerPersonalProfileKey(account), profile);
    },
  });
}
