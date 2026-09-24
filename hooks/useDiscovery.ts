import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { listDiscoveryResults, type DiscoveryFilters, type DiscoveryResult } from "@/services/discovery";

const STALE_TIME = 5 * 60_000;
export function useDiscovery(filters: DiscoveryFilters): UseQueryResult<DiscoveryResult[]> {
  return useQuery({ queryKey: ["public", "discovery", filters], queryFn: () => listDiscoveryResults(filters), staleTime: STALE_TIME });
}
