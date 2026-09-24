import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { ProviderDashboardData } from "@/lib/mock/providerDashboard";
import { getProviderDashboard } from "@/services/providerDashboard";

const providerDashboardQueryKey = (days: number) =>
  ["provider", "dashboard", days] as const;

export function useProviderDashboard(
  days = 30,
): UseQueryResult<ProviderDashboardData> {
  return useQuery({
    queryKey: providerDashboardQueryKey(days),
    queryFn: () => getProviderDashboard(days),
    staleTime: 60_000,
  });
}

