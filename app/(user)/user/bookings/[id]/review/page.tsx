import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { BookingReviewForm } from "@/components/bookings/BookingReviewForm";

type ReviewPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("bookingReview");
  return { title: t("title"), description: t("metaDescription") };
}

export default async function UserBookingReviewPage({ params }: ReviewPageProps): Promise<ReactNode> {
  const { id } = await params;
  return <BookingReviewForm bookingId={id} />;
}
