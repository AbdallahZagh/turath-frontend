import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { AdminOverview } from "@/lib/mock/adminOverview";
import { getAdminOverview } from "@/services/adminOverview";

const adminOverviewQueryKey = (days: number) => ["admin", "overview", days] as const;

export function useAdminOverview(days = 30): UseQueryResult<AdminOverview> {
  return useQuery({
    queryKey: adminOverviewQueryKey(days),
    queryFn: () => getAdminOverview(days),
  });
}
