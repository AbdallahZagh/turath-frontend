import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type {
  ProviderCheckInResult,
  ProviderDeskBooking,
} from "@/lib/mock/providerCheckIn";
import type { ProviderCategory } from "@/lib/validation/auth";
import {
  listProviderArrivals,
  verifyProviderCheckInCode,
} from "@/services/providerCheckIn";

const providerArrivalsKey = (category: ProviderCategory) => ["provider", "check-in", "arrivals", category] as const;

export function useProviderArrivals(category: ProviderCategory): UseQueryResult<ProviderDeskBooking[]> {
  return useQuery({
    queryKey: providerArrivalsKey(category),
    queryFn: () => listProviderArrivals(category),
    staleTime: 30_000,
  });
}

export function useVerifyProviderCheckIn(category: ProviderCategory): UseMutationResult<
  ProviderCheckInResult,
  Error,
  { code: string; staffName: string }
> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input) => verifyProviderCheckInCode({ ...input, category }),
    onSuccess: (result) => {
      if (result.kind === "success") {
        void client.invalidateQueries({ queryKey: ["provider", "check-in", "arrivals"] });
        void client.invalidateQueries({ queryKey: ["provider", "bookings"] });
        void client.invalidateQueries({ queryKey: ["tourist", "bookings"] });
      }
    },
  });
}
