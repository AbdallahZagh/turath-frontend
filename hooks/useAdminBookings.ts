import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type { AdminBooking, BookingStatus } from "@/lib/mock/adminBookings";
import {
  listAdminBookings,
  updateAdminBookingStatus,
} from "@/services/adminBookings";

const adminBookingsQueryKey = ["admin", "bookings"] as const;

export function useAdminBookings(): UseQueryResult<AdminBooking[]> {
  return useQuery({
    queryKey: adminBookingsQueryKey,
    queryFn: listAdminBookings,
  });
}

export function useUpdateAdminBookingStatus(): UseMutationResult<
  AdminBooking,
  Error,
  { id: string; status: BookingStatus }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateAdminBookingStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminBookingsQueryKey });
      void queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "providers"] });
    },
  });
}
