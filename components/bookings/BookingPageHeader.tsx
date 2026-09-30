"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { PageHeader } from "@/components/ui/PageHeader";
import { bookingPageHeader } from "@/config/pageHeaders";
import { USER_PATHS } from "@/config/userRoutes";
import { useTouristBooking } from "@/hooks/useBookings";

/** Voucher or review title for the booking's type (hotel, dining, trip, event, guide). */
export function BookingPageHeader({
  bookingId,
  screen,
}: {
  bookingId: string;
  screen: "voucher" | "review";
}): ReactNode {
  const inAccount = usePathname().startsWith(`${USER_PATHS.home}/`);
  const kind = useTouristBooking(bookingId).data?.type;
  return <PageHeader spec={bookingPageHeader(screen, kind, inAccount)} />;
}
