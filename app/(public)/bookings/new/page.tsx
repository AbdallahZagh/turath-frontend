import type { Metadata } from "next";
import type { ReactNode } from "react";

import { BookingCheckoutScreen, checkoutMetadata } from "@/components/bookings/BookingCheckoutScreen";
import type { ListingSearchParams } from "@/lib/search/listingParams";

type NewBookingPageProps = { searchParams: ListingSearchParams };

export async function generateMetadata({ searchParams }: NewBookingPageProps): Promise<Metadata> {
  return checkoutMetadata(searchParams);
}

export default function NewBookingPage({ searchParams }: NewBookingPageProps): ReactNode {
  return (
    <main className="mx-auto max-w-[98rem] px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24 lg:px-8">
      <BookingCheckoutScreen searchParams={searchParams} />
    </main>
  );
}
