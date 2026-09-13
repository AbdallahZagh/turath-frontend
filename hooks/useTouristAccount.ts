import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { TouristAccount } from "@/lib/mock/touristAccount";
import { getTouristAccount } from "@/services/account";

export function useTouristAccount(): UseQueryResult<TouristAccount> {
  return useQuery({
    queryKey: ["tourist", "account"],
    queryFn: getTouristAccount,
    staleTime: 5 * 60_000,
  });
}
