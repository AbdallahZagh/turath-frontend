import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type {
  ProviderAccountRole,
  ProviderOwnerPersonalProfile,
  ProviderPersonalProfile,
} from "@/lib/mock/providerPersonalProfile";
import type { ProviderPersonalProfileValues } from "@/lib/validation/providerPersonalProfile";
import {
  getProviderPersonalProfile,
  updateProviderPersonalProfile,
} from "@/services/providerPersonalProfile";

function providerPersonalProfileKey(role: ProviderAccountRole): readonly string[] {
  return ["provider", "personal-profile", role] as const;
}

export function useProviderPersonalProfile(
  role: ProviderAccountRole,
): UseQueryResult<ProviderPersonalProfile> {
  return useQuery({
    queryKey: providerPersonalProfileKey(role),
    queryFn: () => getProviderPersonalProfile(role),
    staleTime: 60_000,
  });
}

export function useUpdateProviderPersonalProfile(): UseMutationResult<
  ProviderOwnerPersonalProfile,
  Error,
  { values: ProviderPersonalProfileValues }
> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: updateProviderPersonalProfile,
    onSuccess: (profile) => {
      client.setQueryData(providerPersonalProfileKey("PROVIDER_OWNER"), profile);
    },
  });
}
