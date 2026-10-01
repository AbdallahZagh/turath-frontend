import type { Metadata } from "next";
import type { ReactNode } from "react";

import { BookingPageHeader } from "@/components/bookings/BookingPageHeader";
import { bookingScreenMetadata } from "@/components/bookings/bookingScreenMetadata";
import { BookingVoucher } from "@/components/bookings/BookingVoucher";

type BookingPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: BookingPageProps): Promise<Metadata> {
  return bookingScreenMetadata(params, "voucher");
}

export default async function BookingPage({ params }: BookingPageProps): Promise<ReactNode> {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-[98rem] px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <BookingPageHeader bookingId={id} screen="voucher" />
      </div>
      <BookingVoucher bookingId={id} />
    </div>
  );
}
