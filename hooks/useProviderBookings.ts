import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type { TouristBookingStatus } from "@/lib/mock/bookings";
import type { ProviderBooking } from "@/lib/mock/providerBookings";
import type { ProviderCategory } from "@/lib/validation/auth";
import {
  getProviderBooking,
  listProviderBookings,
  updateProviderBookingStatus,
} from "@/services/providerBookings";

const providerBookingsKey = (category: ProviderCategory) => ["provider", "bookings", category] as const;
const providerBookingKey = (category: ProviderCategory, id: string) => ["provider", "bookings", category, id] as const;

export function useProviderBookings(category: ProviderCategory): UseQueryResult<ProviderBooking[]> {
  return useQuery({
    queryKey: providerBookingsKey(category),
    queryFn: () => listProviderBookings(category),
    staleTime: 30_000,
  });
}

export function useProviderBooking(
  id: string,
  category: ProviderCategory,
): UseQueryResult<ProviderBooking | null> {
  return useQuery({
    queryKey: providerBookingKey(category, id),
    queryFn: () => getProviderBooking(id, category),
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
      client.setQueryData(providerBookingKey(booking.category, booking.id), booking);
      client.setQueryData<ProviderBooking[]>(providerBookingsKey(booking.category), (current) =>
        current?.map((item) => (item.id === booking.id ? booking : item)),
      );
      void client.invalidateQueries({ queryKey: ["provider", "check-in"] });
    },
  });
}
