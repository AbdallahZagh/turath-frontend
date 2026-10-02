"use client";

import { BedDouble, Bus, CalendarDays, Clock3, Languages, MapPin, Moon, Sparkles, Ticket, Users } from "lucide-react";
import { useLocale } from "next-intl";
import type { ReactNode } from "react";

import { UniversalBookingPass } from "@/components/bookings/UniversalBookingPass";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { USER_PATHS } from "@/config/userRoutes";
import { useBookingPaths } from "@/hooks/useBookingPaths";
import { useTouristBooking } from "@/hooks/useBookings";
import { useEvent } from "@/hooks/useEvents";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import { useGuide } from "@/hooks/useGuides";
import { useHotel } from "@/hooks/useHotels";
import { useRestaurant } from "@/hooks/useRestaurants";
import { useTrip } from "@/hooks/useTrips";
import type { Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/translations";
import { formatMediumDate, formatPickerTime } from "@/lib/format/datetime";
import { localizedName } from "@/lib/i18n/localized";
import { VISITED_BOOKING_STATUS } from "@/lib/mock/bookings";

export function BookingVoucher({ bookingId }: { bookingId: string }): ReactNode {
  const t = useTranslations("bookings");
  const tr = useTranslations("restaurantBooking");
  const tt = useTranslations("tripBooking");
  const te = useTranslations("eventBooking");
  const tg = useTranslations("guideBooking");
  const tGuides = useTranslations("guides");
  const tEventTiers = useTranslations("events.tiers");
  const tRooms = useTranslations("hotels.roomTypes");
  const tZones = useTranslations("restaurants.zones");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const formatMoney = useFormatSyp();
  const paths = useBookingPaths();
  const bookingQuery = useTouristBooking(bookingId);
  const booking = bookingQuery.data;
  const hotelQuery = useHotel(booking?.type === "hotel" ? booking.hotelId : "");
  const restaurantQuery = useRestaurant(booking?.type === "restaurant" ? booking.restaurantId : "");
  const tripQuery = useTrip(booking?.type === "trip" ? booking.tripId : "");
  const eventQuery = useEvent(booking?.type === "event" ? booking.eventId : "");
  const guideQuery = useGuide(booking?.type === "guide" ? booking.guideId : "");

  if (bookingQuery.isPending) return <Skeleton className="mx-auto h-[40rem] max-w-6xl" />;
  if (bookingQuery.isError) return <ErrorState title={t("states.voucherErrorTitle")} description={t("states.loadErrorBody")} retryLabel={t("states.retry")} onRetry={() => void bookingQuery.refetch()} />;
  if (!booking) return <EmptyState icon={BedDouble} title={t("states.voucherMissingTitle")} description={t("states.voucherMissingBody")} action={<Button href={paths.catalog("hotels")} variant="outline">{t("backToHotels")}</Button>} />;

  const discountLabel = booking.couponCode ? `${t("discount")} (${booking.couponCode})` : t("discount");
  const shared = {
    passLabel: t("voucher.passLabel"),
    downloadLabel: t("voucher.downloadQr"),
    printLabel: t("voucher.print"),
    logoAlt: t("voucher.logoAlt"),
    statusLabel: t(`voucher.status.${booking.status}`),
    referenceLabel: t("voucher.reference"),
    reference: booking.reference,
    listPriceLabel: t("listPrice"),
    listPrice: formatMoney(booking.listPriceSyp),
    discount: booking.discountSyp > 0 ? { label: discountLabel, value: formatMoney(booking.discountSyp) } : undefined,
    totalLabel: t("cashDue"),
    total: formatMoney(booking.cashDueSyp),
    qrValue: booking.qrPayload,
    qrTitle: t("voucher.showOnArrival"),
    qrHint: t("voucher.qrHint"),
    backupLabel: t("voucher.backupTitle"),
    backupCode: booking.backupCode,
    backupHint: t("voucher.backupHint"),
  };

  let pass: ReactNode;
  if (booking.type === "hotel") {
    if (hotelQuery.isPending) return <Skeleton className="mx-auto h-[40rem] max-w-6xl" />;
    if (hotelQuery.isError || !hotelQuery.data) return <ErrorState title={t("states.voucherErrorTitle")} description={t("states.loadErrorBody")} retryLabel={t("states.retry")} onRetry={() => void hotelQuery.refetch()} />;
    const hotel = hotelQuery.data;
    const room = hotel.rooms.find((item) => item.id === booking.roomId);
    pass = <UniversalBookingPass {...shared} totalHint={t("cashDueHint")} providerName={localizedName(hotel.name, loc)} providerAddress={localizedName(hotel.address, loc)} start={{ label: t("checkIn"), value: formatMediumDate(booking.checkIn, loc), detail: formatPickerTime(hotel.checkInTime, loc) }} end={{ label: t("checkOut"), value: formatMediumDate(booking.checkOut, loc), detail: formatPickerTime(hotel.checkOutTime, loc) }} routeLabel={t("voucher.stayLength")} routeValue={t("voucher.nights", { count: booking.nights })} facts={[{ icon: BedDouble, label: t("voucher.room"), value: room ? tRooms(room.type) : t("notSelected") }, { icon: Users, label: t("guests"), value: t("voucher.guests", { count: booking.guests }) }, { icon: Moon, label: t("nights"), value: t("voucher.nights", { count: booking.nights }) }]} />;
  } else if (booking.type === "restaurant") {
    if (restaurantQuery.isPending) return <Skeleton className="mx-auto h-[40rem] max-w-6xl" />;
    if (restaurantQuery.isError || !restaurantQuery.data) return <ErrorState title={t("states.voucherErrorTitle")} description={t("states.loadErrorBody")} retryLabel={t("states.retry")} onRetry={() => void restaurantQuery.refetch()} />;
    const restaurant = restaurantQuery.data;
    pass = <UniversalBookingPass {...shared} totalHint={tr("cashDueHint")} providerName={localizedName(restaurant.name, loc)} providerAddress={localizedName(restaurant.address, loc)} start={{ label: tr("voucher.date"), value: formatMediumDate(booking.date, loc) }} end={{ label: tr("voucher.arrival"), value: formatPickerTime(booking.timeSlot, loc) }} routeLabel={tr("voucher.reservation")} routeValue={tr("voucher.tableFor", { count: booking.partySize })} facts={[{ icon: MapPin, label: tr("voucher.zone"), value: tZones(booking.zoneId) }, { icon: Users, label: tr("partySize"), value: tr("voucher.guests", { count: booking.partySize }) }]} />;
  } else if (booking.type === "trip") {
    if (tripQuery.isPending) return <Skeleton className="mx-auto h-[40rem] max-w-6xl" />;
    if (tripQuery.isError || !tripQuery.data) return <ErrorState title={t("states.voucherErrorTitle")} description={t("states.loadErrorBody")} retryLabel={t("states.retry")} onRetry={() => void tripQuery.refetch()} />;
    const trip = tripQuery.data;
    const pickup = trip.pickupPoints.find((item) => item.id === booking.pickupPointId);
    pass = <UniversalBookingPass {...shared} totalHint={tt("cashDueHint")} providerName={localizedName(trip.name, loc)} providerAddress={localizedName(trip.address, loc)} start={{ label: tt("voucher.date"), value: formatMediumDate(booking.date, loc) }} end={{ label: tt("voucher.pickupTime"), value: pickup ? formatPickerTime(pickup.time, loc) : "—" }} routeLabel={tt("voucher.journey")} routeValue={localizedName(trip.durationDetail, loc)} facts={[{ icon: MapPin, label: tt("pickup"), value: pickup ? localizedName(pickup.name, loc) : t("notSelected") }, { icon: Users, label: tt("seats"), value: tt("voucher.travelers", { count: booking.seats }) }, { icon: Bus, label: tt("voucher.operator"), value: localizedName(trip.providerName, loc) }]} />;
  } else if (booking.type === "event") {
    if (eventQuery.isPending) return <Skeleton className="mx-auto h-[40rem] max-w-6xl" />;
    if (eventQuery.isError || !eventQuery.data) return <ErrorState title={t("states.voucherErrorTitle")} description={t("states.loadErrorBody")} retryLabel={t("states.retry")} onRetry={() => void eventQuery.refetch()} />;
    const event = eventQuery.data;
    pass = <UniversalBookingPass {...shared} totalHint={te("cashDueHint")} providerName={localizedName(event.name, loc)} providerAddress={localizedName(event.address, loc)} start={{ label: te("voucher.date"), value: formatMediumDate(booking.date, loc) }} end={{ label: te("voucher.doors"), value: formatPickerTime(booking.startsAt, loc) }} routeLabel={te("voucher.admission")} routeValue={tEventTiers(booking.ticketTier)} facts={[{ icon: MapPin, label: te("voucher.venue"), value: localizedName(event.venue, loc) }, { icon: Ticket, label: te("tier"), value: tEventTiers(booking.ticketTier) }, { icon: CalendarDays, label: te("quantity"), value: te("voucher.tickets", { count: booking.quantity }) }]} />;
  } else {
    if (guideQuery.isPending) return <Skeleton className="mx-auto h-[40rem] max-w-6xl" />;
    if (guideQuery.isError || !guideQuery.data) return <ErrorState title={t("states.voucherErrorTitle")} description={t("states.loadErrorBody")} retryLabel={t("states.retry")} onRetry={() => void guideQuery.refetch()} />;
    const guide = guideQuery.data;
    pass = <UniversalBookingPass {...shared} totalHint={tg("cashDueHint")} providerName={localizedName(guide.name, loc)} providerAddress={localizedName(guide.address, loc)} start={{ label: tg("voucher.date"), value: formatMediumDate(booking.date, loc) }} end={{ label: tg("voucher.duration"), value: tGuides(`durations.${booking.duration}`) }} routeLabel={tg("voucher.experience")} routeValue={tGuides(`specialties.${booking.focusArea}`)} facts={[{ icon: Languages, label: tg("language"), value: tGuides(`languages.${booking.language}`) }, { icon: Sparkles, label: tg("focusArea"), value: tGuides(`specialties.${booking.focusArea}`) }, { icon: Clock3, label: tg("hours"), value: tg("voucher.hours", { count: booking.hours }) }]} />;
  }

  return <>{pass}{VISITED_BOOKING_STATUS[booking.status] ? <div className="mx-auto mt-6 flex max-w-6xl justify-center"><Button href={USER_PATHS.review(booking.id)}>{t("voucher.writeReview")}</Button></div> : null}</>;
}
