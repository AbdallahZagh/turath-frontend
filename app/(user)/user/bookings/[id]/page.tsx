import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { BookingPageHeader } from "@/components/bookings/BookingPageHeader";
import { BookingVoucher } from "@/components/bookings/BookingVoucher";

type UserBookingPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("bookings.headers.voucher");
  return { title: t("title"), description: t("description") };
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
