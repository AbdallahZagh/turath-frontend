"use client";

import { usePathname } from "next/navigation";

import { USER_PATHS } from "@/config/userRoutes";

type ListingCategory = "hotels" | "restaurants" | "trips" | "events" | "guides";

export type BookingPaths = {
  /** Checkout route: `/bookings/new` publicly, `/user/bookings/new` inside the account. */
  checkout: string;
  voucher: (bookingId: string) => string;
  catalog: (category: ListingCategory) => string;
  listing: (category: ListingCategory, id: string) => string;
};

/** Booking links stay inside the account shell when the flow started there. */
export function useBookingPaths(): BookingPaths {
  const inAccount = usePathname().startsWith(`${USER_PATHS.home}/`);
  const prefix = inAccount ? USER_PATHS.home : "";
  return {
    checkout: inAccount ? USER_PATHS.newBooking : "/bookings/new",
    voucher: (bookingId) => (inAccount ? USER_PATHS.booking(bookingId) : `/bookings/${bookingId}`),
    catalog: (category) => `${prefix}/${category}`,
    listing: (category, id) => `${prefix}/${category}/${id}`,
  };
}
