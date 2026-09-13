import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { BookingVoucher } from "@/components/bookings/BookingVoucher";

type BookingPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("bookings.voucher");
  return { title: `${t("title")} | Turath`, description: t("subtitle") };
}

export default async function BookingPage({ params }: BookingPageProps): Promise<ReactNode> {
  const { id } = await params;
  return <main className="mx-auto max-w-[98rem] px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24 lg:px-8"><BookingVoucher bookingId={id} /></main>;
}
