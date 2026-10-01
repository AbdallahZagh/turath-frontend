import type { Metadata } from "next";
import type { ReactNode } from "react";

import {
  BookingCheckoutScreen,
  checkoutMetadata,
} from "@/components/bookings/BookingCheckoutScreen";
import type { ListingSearchParams } from "@/lib/search/listingParams";

type UserNewBookingPageProps = { searchParams: ListingSearchParams };

export async function generateMetadata({
  searchParams,
}: UserNewBookingPageProps): Promise<Metadata> {
  return checkoutMetadata(searchParams);
}

export default function UserNewBookingPage({ searchParams }: UserNewBookingPageProps): ReactNode {
  return <BookingCheckoutScreen searchParams={searchParams} />;
}
