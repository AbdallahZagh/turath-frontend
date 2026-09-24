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
import {
  listProviderArrivals,
  verifyProviderCheckInCode,
} from "@/services/providerCheckIn";

const providerArrivalsKey = ["provider", "check-in", "arrivals"] as const;

export function useProviderArrivals(): UseQueryResult<ProviderDeskBooking[]> {
  return useQuery({
    queryKey: providerArrivalsKey,
    queryFn: listProviderArrivals,
    staleTime: 30_000,
  });
}

export function useVerifyProviderCheckIn(): UseMutationResult<
  ProviderCheckInResult,
  Error,
  { code: string; staffName: string }
> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: verifyProviderCheckInCode,
    onSuccess: (result) => {
      if (result.kind === "success") {
        void client.invalidateQueries({ queryKey: providerArrivalsKey });
        void client.invalidateQueries({ queryKey: ["provider", "bookings"] });
        void client.invalidateQueries({ queryKey: ["tourist", "bookings"] });
      }
    },
  });
}
