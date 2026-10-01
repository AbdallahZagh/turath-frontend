import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { ProviderDashboardData } from "@/lib/mock/providerDashboard";
import type { ProviderCategory } from "@/lib/validation/auth";
import { getProviderDashboard } from "@/services/providerDashboard";

const providerDashboardQueryKey = (days: number, category: ProviderCategory) =>
  ["provider", "dashboard", category, days] as const;

export function useProviderDashboard(
  days = 30,
  category: ProviderCategory = "hotels",
): UseQueryResult<ProviderDashboardData> {
  return useQuery({
    queryKey: providerDashboardQueryKey(days, category),
    queryFn: () => getProviderDashboard(days, category),
    staleTime: 60_000,
  });
}
