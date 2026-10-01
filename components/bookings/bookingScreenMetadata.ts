import type { Metadata } from "next";

import { bookingPageHeader } from "@/config/pageHeaders";
import { getTranslations } from "@/i18n/serverTranslations";
import { listMockTouristBookings } from "@/lib/mock/bookings";

/**
 * Tab title for a booking's voucher or review page, by booking type ("Your stay voucher",
 * "Review your guide"). Same keys as the on-page header (config/pageHeaders.ts). A booking made
 * in this browser session is not known on the server, so it gets the general title.
 */
export async function bookingScreenMetadata(
  params: Promise<{ id: string }>,
  screen: "voucher" | "review",
): Promise<Metadata> {
  const { id } = await params;
  const kind = listMockTouristBookings().find((booking) => booking.id === id)?.type;
  const { page } = bookingPageHeader(screen, kind, false);
  const t = await getTranslations("bookings.headers");
  // bookingPageHeader only returns bookings.headers pages (voucher, review, hotelVoucher, …).
  const header = page as "voucher";
  return { title: t(`${header}.title`), description: t(`${header}.description`) };
}
