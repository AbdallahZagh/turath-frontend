import type { Metadata } from "next";
import type { ReactNode } from "react";

import { EventBookingCheckout } from "@/components/bookings/EventBookingCheckout";
import { GuideBookingCheckout } from "@/components/bookings/GuideBookingCheckout";
import { HotelBookingCheckout } from "@/components/bookings/HotelBookingCheckout";
import { RestaurantBookingCheckout } from "@/components/bookings/RestaurantBookingCheckout";
import { TripBookingCheckout } from "@/components/bookings/TripBookingCheckout";
import { PageHeader } from "@/components/ui/PageHeader";
import { CHECKOUT_PAGE_HEADERS } from "@/config/pageHeaders";
import { getTranslations } from "@/i18n/serverTranslations";
import { toIsoDate } from "@/lib/format/datetime";
import {
  BOOKING_SEARCH_KEYS,
  sanitizeBookingSearch,
  type BookingKind,
  type BookingSearchInput,
} from "@/lib/search/bookingSearch";
import { firstSearchValue, type ListingSearchParams } from "@/lib/search/listingParams";
import { getEvent } from "@/services/events";
import { getRestaurant } from "@/services/restaurants";
import { getTrip } from "@/services/trips";

const BOOKING_KINDS: readonly BookingKind[] = ["hotel", "restaurant", "trip", "event", "guide"];

function bookingKind(value: string | undefined): BookingKind {
  return BOOKING_KINDS.find((kind) => kind === value) ?? "hotel";
}

export async function checkoutMetadata(searchParams: ListingSearchParams): Promise<Metadata> {
  const kind = bookingKind(firstSearchValue((await searchParams).type));
  const t = await getTranslations(`bookings.headers.${kind}`);
  return { title: t("title"), description: t("description") };
}

/**
 * `/bookings/new` and `/user/bookings/new`. Dates and people come from the URL
 * (lib/search/bookingSearch.ts); anything invalid falls back to the checkout's defaults.
 */
export async function BookingCheckoutScreen({
  searchParams,
}: {
  searchParams: ListingSearchParams;
}): Promise<ReactNode> {
  const params = await searchParams;
  const kind = bookingKind(firstSearchValue(params.type));
  const id = firstSearchValue(params.id) ?? "";
  const raw: BookingSearchInput = {};
  for (const key of BOOKING_SEARCH_KEYS) raw[key] = firstSearchValue(params[key]);
  const search = sanitizeBookingSearch(raw, toIsoDate(new Date()));

  let checkout: ReactNode;
  if (kind === "restaurant") {
    const restaurant = await getRestaurant(id);
    const time =
      search.time && restaurant?.timeSlots.includes(search.time) ? search.time : undefined;
    checkout = (
      <RestaurantBookingCheckout
        restaurantId={id}
        initialDate={search.date}
        initialTime={time}
        initialPartySize={search.partySize ?? 2}
      />
    );
  } else if (kind === "trip") {
    const trip = await getTrip(id);
    const departure =
      trip?.departures.find((item) => item.date === search.date) ?? trip?.departures[0];
    const seats = search.seats ?? 1;
    checkout = (
      <TripBookingCheckout
        tripId={id}
        initialDate={departure?.date}
        initialSeats={departure && seats > departure.seatsLeft ? 1 : seats}
      />
    );
  } else if (kind === "event") {
    const event = await getEvent(id);
    const session =
      event?.sessions.find((item) => item.id === search.session) ??
      event?.sessions.find((item) => item.date === search.date) ??
      event?.sessions[0];
    checkout = (
      <EventBookingCheckout
        eventId={id}
        initialSessionId={session?.id}
        initialQuantity={search.qty ?? 1}
      />
    );
  } else if (kind === "guide") {
    checkout = <GuideBookingCheckout guideId={id} initialDate={search.date} />;
  } else {
    checkout = (
      <HotelBookingCheckout
        hotelId={id}
        initialCheckIn={search.checkIn}
        initialCheckOut={search.checkOut}
        initialGuests={search.guests ?? 1}
      />
    );
  }

  return (
    <>
      <PageHeader spec={CHECKOUT_PAGE_HEADERS[kind]} />
      {checkout}
    </>
  );
}
