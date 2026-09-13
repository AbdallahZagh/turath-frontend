"use client";

import { Bus, CalendarDays, CalendarHeart, MessageSquareQuote, TicketCheck, UtensilsCrossed } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SegmentSwitch } from "@/components/ui/SegmentSwitch";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTouristBookings } from "@/hooks/useBookings";
import { useEvents } from "@/hooks/useEvents";
import { useHotels } from "@/hooks/useHotels";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useTrips } from "@/hooks/useTrips";
import { USER_PATHS } from "@/config/userRoutes";
import type { Locale } from "@/i18n/config";
import { formatMediumDate, toIsoDate } from "@/lib/format/datetime";
import { formatSyp } from "@/lib/format/money";
import { localizedName } from "@/lib/i18n/localized";
import type { TouristBooking } from "@/lib/mock/bookings";

type BookingTab = "upcoming" | "past" | "cancelled";

function bookingDate(booking: TouristBooking): string {
  return booking.type === "hotel" ? booking.checkIn : booking.date;
}

function bookingEndDate(booking: TouristBooking): string {
  return booking.type === "hotel" ? booking.checkOut : booking.date;
}

function tabForBooking(booking: TouristBooking, today: string): BookingTab {
  if (booking.status === "CANCELLED") return "cancelled";
  return bookingEndDate(booking) >= today ? "upcoming" : "past";
}

export function AccountBookings(): ReactNode {
  const t = useTranslations("account.bookings");
  const tStatus = useTranslations("bookings.voucher.status");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const [tab, setTab] = useState<BookingTab>("upcoming");
  const bookingsQuery = useTouristBookings();
  const hotelsQuery = useHotels({});
  const restaurantsQuery = useRestaurants({});
  const tripsQuery = useTrips({});
  const eventsQuery = useEvents({});

  if (bookingsQuery.isPending || hotelsQuery.isPending || restaurantsQuery.isPending || tripsQuery.isPending || eventsQuery.isPending) return <Skeleton className="h-[30rem]" />;
  if (bookingsQuery.isError || hotelsQuery.isError || restaurantsQuery.isError || tripsQuery.isError || eventsQuery.isError) {
    return <ErrorState title={t("errorTitle")} description={t("errorBody")} retryLabel={t("retry")} onRetry={() => { void bookingsQuery.refetch(); void hotelsQuery.refetch(); void restaurantsQuery.refetch(); void tripsQuery.refetch(); void eventsQuery.refetch(); }} />;
  }

  const today = toIsoDate(new Date());
  const bookings = bookingsQuery.data.filter((booking) => tabForBooking(booking, today) === tab);

  return (
    <div>
      <SegmentSwitch
        variant="glass"
        className="w-full sm:w-fit"
        aria-label={t("tabsLabel")}
        value={tab}
        options={(["upcoming", "past", "cancelled"] as const).map((value) => ({ value, label: t(`tabs.${value}`) }))}
        onChange={(value) => { if (value === "upcoming" || value === "past" || value === "cancelled") setTab(value); }}
      />

      {bookings.length === 0 ? (
        <EmptyState className="mt-5" icon={CalendarDays} title={t(`empty.${tab}.title`)} description={t(`empty.${tab}.description`)} action={tab === "upcoming" ? <Button href={USER_PATHS.hotels} variant="outline">{t("browse")}</Button> : undefined} />
      ) : (
        <div className="mt-5 space-y-4">
          {bookings.map((booking) => {
            const provider = booking.type === "hotel"
              ? hotelsQuery.data.find((item) => item.id === booking.hotelId)
              : booking.type === "restaurant"
                ? restaurantsQuery.data.find((item) => item.id === booking.restaurantId)
                : booking.type === "trip"
                  ? tripsQuery.data.find((item) => item.id === booking.tripId)
                  : eventsQuery.data.find((item) => item.id === booking.eventId);
            const ProviderIcon = booking.type === "restaurant" ? UtensilsCrossed : booking.type === "trip" ? Bus : booking.type === "event" ? CalendarHeart : TicketCheck;
            return (
              <GlassPanel key={booking.id} className="p-5 sm:p-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-center">
                  <span className="bg-primary/12 text-primary grid size-12 shrink-0 place-items-center rounded-2xl"><ProviderIcon className="size-5" aria-hidden /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><h2 className="font-heading text-prose text-xl font-semibold">{provider ? localizedName(provider.name, loc) : booking.reference}</h2><Badge variant="outline">{tStatus(booking.status)}</Badge></div>
                    <p className="text-prose-muted mt-1 text-sm">{formatMediumDate(bookingDate(booking), loc)}{booking.type === "hotel" ? ` – ${formatMediumDate(booking.checkOut, loc)}` : booking.type === "restaurant" ? ` · ${booking.timeSlot}` : booking.type === "trip" ? ` · ${t("travelers", { count: booking.seats })}` : ` · ${t("tickets", { count: booking.quantity })}`}</p>
                    <p className="text-prose mt-2 text-sm font-semibold">{formatSyp(booking.cashDueSyp, loc)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {booking.status === "CHECKED_IN" ? <Button href={`/user/bookings/${booking.id}/review`} variant="glass" size="sm"><MessageSquareQuote className="size-4" aria-hidden />{t("review")}</Button> : null}
                    <Button href={`/bookings/${booking.id}`} variant="outline" size="sm">{t("voucher")}</Button>
                  </div>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      )}
    </div>
  );
}
