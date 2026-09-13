"use client";

import { BedDouble, Moon, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { UniversalBookingPass } from "@/components/bookings/UniversalBookingPass";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTouristBooking } from "@/hooks/useBookings";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import { useHotel } from "@/hooks/useHotels";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import { localizedName } from "@/lib/i18n/localized";

type BookingVoucherProps = { bookingId: string };

export function BookingVoucher({ bookingId }: BookingVoucherProps): ReactNode {
  const t = useTranslations("bookings");
  const tRooms = useTranslations("hotels.roomTypes");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const formatMoney = useFormatSyp();
  const bookingQuery = useTouristBooking(bookingId);
  const hotelQuery = useHotel(bookingQuery.data?.hotelId ?? "");

  if (bookingQuery.isPending) {
    return <Skeleton className="mx-auto h-[40rem] max-w-6xl" />;
  }
  if (bookingQuery.isError) {
    return (
      <ErrorState
        title={t("states.voucherErrorTitle")}
        description={t("states.loadErrorBody")}
        retryLabel={t("states.retry")}
        onRetry={() => void bookingQuery.refetch()}
      />
    );
  }

  const booking = bookingQuery.data;
  if (!booking) {
    return (
      <EmptyState
        icon={BedDouble}
        title={t("states.voucherMissingTitle")}
        description={t("states.voucherMissingBody")}
        action={
          <Button href="/hotels" variant="outline">
            {t("backToHotels")}
          </Button>
        }
      />
    );
  }

  if (hotelQuery.isPending) {
    return <Skeleton className="mx-auto h-[40rem] max-w-6xl" />;
  }
  if (hotelQuery.isError || !hotelQuery.data) {
    return (
      <ErrorState
        title={t("states.voucherErrorTitle")}
        description={t("states.loadErrorBody")}
        retryLabel={t("states.retry")}
        onRetry={() => void hotelQuery.refetch()}
      />
    );
  }

  const hotel = hotelQuery.data;
  const room = hotel.rooms.find((item) => item.id === booking.roomId);
  const discountLabel = booking.couponCode
    ? `${t("discount")} (${booking.couponCode})`
    : t("discount");

  return (
    <>
      <UniversalBookingPass
      pageEyebrow={t("voucher.eyebrow")}
      pageTitle={t("voucher.title")}
      pageDescription={t("voucher.subtitle")}
      passLabel={t("voucher.passLabel")}
      downloadLabel={t("voucher.downloadQr")}
      printLabel={t("voucher.print")}
      logoAlt={t("voucher.logoAlt")}
      statusLabel={t(`voucher.status.${booking.status}`)}
      referenceLabel={t("voucher.reference")}
      reference={booking.reference}
      providerName={localizedName(hotel.name, loc)}
      providerAddress={localizedName(hotel.address, loc)}
      start={{
        label: t("checkIn"),
        value: formatMediumDate(booking.checkIn, loc),
        detail: hotel.checkInTime,
      }}
      end={{
        label: t("checkOut"),
        value: formatMediumDate(booking.checkOut, loc),
        detail: hotel.checkOutTime,
      }}
      routeLabel={t("voucher.stayLength")}
      routeValue={t("voucher.nights", { count: booking.nights })}
      facts={[
        {
          icon: BedDouble,
          label: t("voucher.room"),
          value: room ? tRooms(room.type) : t("notSelected"),
        },
        {
          icon: Users,
          label: t("guests"),
          value: t("voucher.guests", { count: booking.guests }),
        },
        {
          icon: Moon,
          label: t("nights"),
          value: t("voucher.nights", { count: booking.nights }),
        },
      ]}
      listPriceLabel={t("listPrice")}
      listPrice={formatMoney(booking.listPriceSyp)}
      discount={
        booking.discountSyp > 0
          ? { label: discountLabel, value: formatMoney(booking.discountSyp) }
          : undefined
      }
      totalLabel={t("cashDue")}
      total={formatMoney(booking.cashDueSyp)}
      totalHint={t("cashDueHint")}
      qrValue={booking.qrPayload}
      qrTitle={t("voucher.showOnArrival")}
      qrHint={t("voucher.qrHint")}
      backupLabel={t("voucher.backupTitle")}
      backupCode={booking.backupCode}
        backupHint={t("voucher.backupHint")}
      />
      {booking.status === "CHECKED_IN" ? (
        <div className="mx-auto mt-6 flex max-w-6xl justify-center">
          <Button href={`/user/bookings/${booking.id}/review`}>
            {t("voucher.writeReview")}
          </Button>
        </div>
      ) : null}
    </>
  );
}
