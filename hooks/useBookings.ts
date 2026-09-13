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
  CreateRestaurantBookingInput,
  CreateTripBookingInput,
  CreateEventBookingInput,
  HotelBooking,
  RestaurantBooking,
  TripBooking,
  EventBooking,
  TouristBooking,
  TouristBookingReview,
} from "@/lib/mock/bookings";
import {
  createHotelBooking,
  createRestaurantBooking,
  createTripBooking,
  createEventBooking,
  getTouristBooking,
  listTouristBookings,
  submitTouristBookingReview,
  validateBookingCoupon,
} from "@/services/bookings";

export function useTouristBooking(id: string): UseQueryResult<TouristBooking | null> {
  return useQuery({
    queryKey: ["tourist", "bookings", id],
    queryFn: () => getTouristBooking(id),
    enabled: Boolean(id),
  });
}

export function useTouristBookings(): UseQueryResult<TouristBooking[]> {
  return useQuery({
    queryKey: ["tourist", "bookings"],
    queryFn: listTouristBookings,
  });
}

export function useCreateRestaurantBooking(): UseMutationResult<RestaurantBooking, Error, CreateRestaurantBookingInput> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRestaurantBooking,
    onSuccess: (booking) => {
      queryClient.setQueryData(["tourist", "bookings", booking.id], booking);
      queryClient.setQueryData<TouristBooking[]>(["tourist", "bookings"], (current = []) => [
        booking,
        ...current.filter((item) => item.id !== booking.id),
      ]);
    },
  });
}

export function useCreateTripBooking(): UseMutationResult<TripBooking, Error, CreateTripBookingInput> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTripBooking,
    onSuccess: (booking) => {
      queryClient.setQueryData(["tourist", "bookings", booking.id], booking);
      queryClient.setQueryData<TouristBooking[]>(["tourist", "bookings"], (current = []) => [booking, ...current.filter((item) => item.id !== booking.id)]);
    },
  });
}

export function useCreateEventBooking(): UseMutationResult<EventBooking, Error, CreateEventBookingInput> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEventBooking,
    onSuccess: (booking) => {
      queryClient.setQueryData(["tourist", "bookings", booking.id], booking);
      queryClient.setQueryData<TouristBooking[]>(["tourist", "bookings"], (current = []) => [booking, ...current.filter((item) => item.id !== booking.id)]);
    },
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
      queryClient.setQueryData<TouristBooking[]>(["tourist", "bookings"], (current = []) => [
        booking,
        ...current.filter((item) => item.id !== booking.id),
      ]);
    },
  });
}

export function useValidateBookingCoupon(): UseMutationResult<CouponResult, Error, string> {
  return useMutation({ mutationFn: validateBookingCoupon });
}

export function useSubmitTouristBookingReview(): UseMutationResult<
  TouristBookingReview,
  Error,
  Omit<TouristBookingReview, "submittedAt">
> {
  return useMutation({ mutationFn: submitTouristBookingReview });
}
