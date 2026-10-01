import type { Metadata } from "next";
import type { ReactNode } from "react";

import { BookingPageHeader } from "@/components/bookings/BookingPageHeader";
import { bookingScreenMetadata } from "@/components/bookings/bookingScreenMetadata";
import { BookingReviewForm } from "@/components/bookings/BookingReviewForm";

type ReviewPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  return bookingScreenMetadata(params, "review");
}

export default async function UserBookingReviewPage({ params }: ReviewPageProps): Promise<ReactNode> {
  const { id } = await params;
  return (
    <>
      <BookingPageHeader bookingId={id} screen="review" />
      <BookingReviewForm bookingId={id} />
    </>
  );
}
