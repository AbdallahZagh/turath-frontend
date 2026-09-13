import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type {
  CouponResult,
  CreateHotelBookingInput,
  HotelBooking,
  TouristBookingReview,
} from "@/lib/mock/bookings";
import {
  createHotelBooking,
  getTouristBooking,
  listTouristBookings,
  submitTouristBookingReview,
  validateHotelCoupon,
} from "@/services/bookings";

export function useTouristBooking(id: string): UseQueryResult<HotelBooking | null> {
  return useQuery({
    queryKey: ["tourist", "bookings", id],
    queryFn: () => getTouristBooking(id),
    enabled: Boolean(id),
  });
}

export function useTouristBookings(): UseQueryResult<HotelBooking[]> {
  return useQuery({
    queryKey: ["tourist", "bookings"],
    queryFn: listTouristBookings,
  });
}

export function useCreateHotelBooking(): UseMutationResult<
  HotelBooking,
  Error,
  CreateHotelBookingInput
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHotelBooking,
    onSuccess: (booking) => {
      queryClient.setQueryData(["tourist", "bookings", booking.id], booking);
    },
  });
}

export function useValidateHotelCoupon(): UseMutationResult<CouponResult, Error, string> {
  return useMutation({ mutationFn: validateHotelCoupon });
}

export function useSubmitTouristBookingReview(): UseMutationResult<
  TouristBookingReview,
  Error,
  Omit<TouristBookingReview, "submittedAt">
> {
  return useMutation({ mutationFn: submitTouristBookingReview });
}
