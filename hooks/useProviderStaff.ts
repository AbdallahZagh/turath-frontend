import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type { ProviderStaffMember } from "@/lib/mock/providerStaff";
import type { ProviderStaffInviteValues } from "@/lib/validation/providerStaff";
import {
  inviteProviderStaff,
  listProviderStaff,
  setProviderStaffActive,
} from "@/services/providerStaff";

const providerStaffKey = ["provider", "staff"] as const;

export function useProviderStaff(): UseQueryResult<ProviderStaffMember[]> {
  return useQuery({
    queryKey: providerStaffKey,
    queryFn: listProviderStaff,
    staleTime: 30_000,
  });
}

export function useInviteProviderStaff(): UseMutationResult<
  ProviderStaffMember,
  Error,
  ProviderStaffInviteValues
> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: inviteProviderStaff,
    onSuccess: (member) => {
      client.setQueryData<ProviderStaffMember[]>(providerStaffKey, (current = []) => [
        member,
        ...current,
      ]);
    },
  });
}

export function useSetProviderStaffActive(): UseMutationResult<
  ProviderStaffMember,
  Error,
  { id: string; active: boolean }
> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: setProviderStaffActive,
    onSuccess: (member) => {
      client.setQueryData<ProviderStaffMember[]>(providerStaffKey, (current) =>
        current?.map((item) => (item.id === member.id ? member : item)),
      );
    },
  });
}
