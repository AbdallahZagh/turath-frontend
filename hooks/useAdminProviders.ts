import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type { AdminProvider, AdminProviderFinanceInput, ProviderStatus } from "@/lib/mock/adminProviders";
import {
  getAdminProviderDetail,
  listAdminProviders,
  setAdminProviderFinance,
  setAdminProviderStatus,
  type AdminProviderDetailData,
} from "@/services/adminProviders";

const adminProvidersQueryKey = ["admin", "providers"] as const;

function adminProviderQueryKey(
  id: string,
): readonly ["admin", "providers", string] {
  return ["admin", "providers", id] as const;
}

export function useAdminProviders(): UseQueryResult<AdminProvider[]> {
  return useQuery({
    queryKey: adminProvidersQueryKey,
    queryFn: listAdminProviders,
  });
}

export function useAdminProvider(
  id: string,
): UseQueryResult<AdminProviderDetailData | null> {
  return useQuery({
    queryKey: adminProviderQueryKey(id),
    queryFn: () => getAdminProviderDetail(id),
  });
}

function syncProviderCaches(
  client: ReturnType<typeof useQueryClient>,
  provider: AdminProvider,
): void {
  client.setQueryData<AdminProvider[]>(adminProvidersQueryKey, (current) =>
    current?.map((row) => (row.id === provider.id ? provider : row)),
  );
  void client.invalidateQueries({ queryKey: adminProviderQueryKey(provider.id) });
}

type StatusInput = {
  id: string;
  status: ProviderStatus;
};

export function useSetAdminProviderStatus(): UseMutationResult<
  AdminProvider,
  Error,
  StatusInput
> {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => setAdminProviderStatus(id, status),
    onSuccess: (provider) => {
      syncProviderCaches(client, provider);
    },
  });
}

type FinanceInput = {
  id: string;
  finance: AdminProviderFinanceInput;
};

export function useSaveAdminProviderFinance(): UseMutationResult<
  AdminProvider,
  Error,
  FinanceInput
> {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, finance }) => setAdminProviderFinance(id, finance),
    onSuccess: (provider) => {
      syncProviderCaches(client, provider);
    },
  });
}
