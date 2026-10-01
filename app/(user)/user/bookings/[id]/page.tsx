import type { Metadata } from "next";
import type { ReactNode } from "react";

import { BookingPageHeader } from "@/components/bookings/BookingPageHeader";
import { bookingScreenMetadata } from "@/components/bookings/bookingScreenMetadata";
import { BookingVoucher } from "@/components/bookings/BookingVoucher";

type UserBookingPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: UserBookingPageProps): Promise<Metadata> {
  return bookingScreenMetadata(params, "voucher");
}

export default async function UserBookingPage({
  params,
}: UserBookingPageProps): Promise<ReactNode> {
  const { id } = await params;
  return (
    <>
      <BookingPageHeader bookingId={id} screen="voucher" />
      <BookingVoucher bookingId={id} />
    </>
  );
}
