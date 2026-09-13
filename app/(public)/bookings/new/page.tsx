import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { HotelBookingCheckout } from "@/components/bookings/HotelBookingCheckout";

type BookingSearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseGuests(value: string | undefined): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 8 ? parsed : 1;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("bookings");
  return { title: `${t("title")} | Turath`, description: t("metaDescription") };
}

export default async function NewBookingPage({ searchParams }: { searchParams: BookingSearchParams }): Promise<ReactNode> {
  const params = await searchParams;
  const type = firstValue(params.type);
  const id = firstValue(params.id) ?? "";
  return (
    <main className="mx-auto max-w-[98rem] px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24 lg:px-8">
      <HotelBookingCheckout hotelId={type === "hotel" ? id : ""} initialCheckIn={firstValue(params.checkIn)} initialCheckOut={firstValue(params.checkOut)} initialGuests={parseGuests(firstValue(params.guests))} />
    </main>
  );
}
