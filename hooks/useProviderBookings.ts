import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type { TouristBookingStatus } from "@/lib/mock/bookings";
import type { ProviderBooking } from "@/lib/mock/providerBookings";
import {
  getProviderBooking,
  listProviderBookings,
  updateProviderBookingStatus,
} from "@/services/providerBookings";

const providerBookingsKey = ["provider", "bookings"] as const;
const providerBookingKey = (id: string) => ["provider", "bookings", id] as const;

export function useProviderBookings(): UseQueryResult<ProviderBooking[]> {
  return useQuery({
    queryKey: providerBookingsKey,
    queryFn: listProviderBookings,
    staleTime: 30_000,
  });
}

export function useProviderBooking(id: string): UseQueryResult<ProviderBooking | null> {
  return useQuery({
    queryKey: providerBookingKey(id),
    queryFn: () => getProviderBooking(id),
    enabled: Boolean(id),
  });
}

export function useUpdateProviderBookingStatus(): UseMutationResult<
  ProviderBooking,
  Error,
  { id: string; status: TouristBookingStatus }
> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: updateProviderBookingStatus,
    onSuccess: (booking) => {
      client.setQueryData(providerBookingKey(booking.id), booking);
      client.setQueryData<ProviderBooking[]>(providerBookingsKey, (current) =>
        current?.map((item) => (item.id === booking.id ? booking : item)),
      );
      void client.invalidateQueries({ queryKey: ["provider", "check-in"] });
    },
  });
}
