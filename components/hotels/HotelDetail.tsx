"use client";

import {
  ArrowLeft,
  BedDouble,
  CalendarCheck,
  Clock3,
  Hotel as HotelIcon,
  MapPin,
  Navigation,
  ShieldCheck,
  UsersRound,
  Zap,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { HotelAmenityList } from "@/components/hotels/HotelAmenityList";
import { HotelGallery } from "@/components/hotels/HotelGallery";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { StarRating } from "@/components/ui/StarRating";
import { useHotel } from "@/hooks/useHotels";
import type { Locale } from "@/i18n/config";
import { formatSyp } from "@/lib/format/money";
import { localizedName } from "@/lib/i18n/localized";

type HotelDetailProps = {
  hotelId: string;
};

function HotelDetailSkeleton(): ReactNode {
  return (
    <div className="space-y-6">
      <Skeleton className="aspect-[16/7]" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}

export function HotelDetail({ hotelId }: HotelDetailProps): ReactNode {
  const t = useTranslations("hotels");
  const tDetail = useTranslations("hotels.detail");
  const tRooms = useTranslations("hotels.roomTypes");
  const tGov = useTranslations("landing.governorates");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const hotelQuery = useHotel(hotelId);

  if (hotelQuery.isPending) return <HotelDetailSkeleton />;
  if (hotelQuery.isError) {
    return (
      <ErrorState
        title={t("states.detailErrorTitle")}
        description={t("states.errorDescription")}
        retryLabel={t("states.retry")}
        onRetry={() => void hotelQuery.refetch()}
      />
    );
  }
  if (!hotelQuery.data) {
    return (
      <EmptyState
        icon={HotelIcon}
        title={t("states.notFoundTitle")}
        description={t("states.notFoundDescription")}
        action={<Button href="/hotels" variant="outline" size="sm">{tDetail("backToHotels")}</Button>}
      />
    );
  }

  const hotel = hotelQuery.data;
  const hotelName = localizedName(hotel.name, loc);
  const lowestPrice = Math.min(...hotel.rooms.map((room) => room.priceSyp));
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${hotel.coordinates.latitude},${hotel.coordinates.longitude}`;

  return (
    <>
      <Button href="/hotels" variant="glass" size="sm" className="mb-5 w-fit">
        <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
        {tDetail("backToHotels")}
      </Button>

      <HotelGallery images={hotel.gallery} hotelName={hotelName} />

      <div className="mt-7 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-7">
          <section>
            <div className="flex flex-wrap items-center gap-2">
              {hotel.verified ? (
                <Badge variant="solid" icon={<ShieldCheck className="size-3.5" aria-hidden />}>
                  {t("verified")}
                </Badge>
              ) : null}
              <Badge icon={<MapPin className="size-3.5" aria-hidden />}>
                {tGov(hotel.governorate)}
              </Badge>
            </div>
            <h1 className="font-heading text-prose mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {hotelName}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <StarRating value={hotel.rating} size="md" label={t("ratingLabel", { rating: hotel.rating })} />
              <span className="text-prose font-semibold">{hotel.rating.toFixed(1)}</span>
              <span className="text-prose-muted">{t("reviewsCount", { count: hotel.reviewCount })}</span>
              <span aria-hidden className="text-prose-muted">·</span>
              <span className="text-prose-muted">{localizedName(hotel.address, loc)}</span>
            </div>
          </section>

          <GlassPanel className="p-6 sm:p-7">
            <h2 className="font-heading text-prose text-2xl font-semibold">{tDetail("about")}</h2>
            <p className="text-prose-muted mt-3 leading-7">{localizedName(hotel.description, loc)}</p>
          </GlassPanel>

          <GlassPanel className="p-6 sm:p-7">
            <h2 className="font-heading text-prose text-2xl font-semibold">{tDetail("amenities")}</h2>
            <div className="mt-5">
              <HotelAmenityList amenities={hotel.amenities} />
            </div>
          </GlassPanel>

          <GlassPanel className="p-6 sm:p-7">
            <h2 className="font-heading text-prose text-2xl font-semibold">{tDetail("rooms")}</h2>
            <div className="mt-5 grid gap-4">
              {hotel.rooms.map((room) => (
                <div key={room.id} className="bg-glass-control flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-prose flex items-center gap-2 font-semibold">
                      <BedDouble className="text-accent size-5" aria-hidden />
                      {tRooms(room.type)}
                    </h3>
                    <p className="text-prose-muted mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                      <span className="inline-flex items-center gap-1"><UsersRound className="size-4" aria-hidden />{tDetail("roomGuests", { count: room.maxGuests })}</span>
                      <span>{tDetail("roomsLeft", { count: room.available })}</span>
                    </p>
                  </div>
                  <div className="sm:text-end">
                    <p className="text-prose font-semibold">{formatSyp(room.priceSyp, loc)}</p>
                    <p className="text-prose-muted text-xs">{t("perNight")}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <div className="grid gap-7 md:grid-cols-2">
            <GlassPanel className="p-6">
              <h2 className="font-heading text-prose text-xl font-semibold">{tDetail("policies")}</h2>
              <dl className="mt-4 grid gap-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-prose-muted flex items-center gap-2"><Clock3 className="size-4" aria-hidden />{tDetail("checkIn")}</dt>
                  <dd className="text-prose font-medium">{hotel.checkInTime}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-prose-muted flex items-center gap-2"><Clock3 className="size-4" aria-hidden />{tDetail("checkOut")}</dt>
                  <dd className="text-prose font-medium">{hotel.checkOutTime}</dd>
                </div>
                <div className="border-border border-t pt-4">
                  <dt className="text-prose-muted flex items-center gap-2"><Zap className="size-4" aria-hidden />{tDetail("generatorHours")}</dt>
                  <dd className="text-prose mt-1 font-medium">{localizedName(hotel.generatorHours, loc)}</dd>
                </div>
              </dl>
            </GlassPanel>

            <GlassPanel className="p-6">
              <h2 className="font-heading text-prose text-xl font-semibold">{tDetail("location")}</h2>
              <div className="bg-glass-control relative mt-4 grid min-h-36 place-items-center overflow-hidden rounded-2xl">
                <div aria-hidden className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:24px_24px]" />
                <MapPin className="text-primary relative size-9 drop-shadow" aria-hidden />
              </div>
              <p className="text-prose-muted mt-3 text-sm">{localizedName(hotel.address, loc)}</p>
              <a href={mapHref} target="_blank" rel="noreferrer" className="text-primary mt-3 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">
                <Navigation className="size-4" aria-hidden />
                {tDetail("navigate")}
              </a>
            </GlassPanel>
          </div>

          <GlassPanel className="p-6 sm:p-7">
            <h2 className="font-heading text-prose text-2xl font-semibold">{tDetail("reviews")}</h2>
            {hotel.reviews.length > 0 ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {hotel.reviews.map((review) => (
                  <article key={review.id} className="bg-glass-control rounded-2xl p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-prose font-semibold">{review.guestName}</p>
                      <StarRating value={review.rating} label={t("ratingLabel", { rating: review.rating })} />
                    </div>
                    <p className="text-prose-muted mt-3 text-sm leading-relaxed">{localizedName(review.comment, loc)}</p>
                    <time dateTime={review.date} className="text-prose-muted mt-3 block text-xs">{review.date}</time>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-prose-muted mt-3 text-sm">{tDetail("noReviews")}</p>
            )}
          </GlassPanel>
        </div>

        <GlassPanel className="p-6 lg:sticky lg:top-28">
          <p className="text-prose-muted text-sm">{t("from")}</p>
          <p className="text-prose mt-1 text-xl font-semibold">{formatSyp(lowestPrice, loc)}</p>
          <p className="text-prose-muted text-xs">{t("perNight")}</p>
          <div className="border-border my-5 border-t" />
          <p className="text-prose-muted text-sm leading-relaxed">{tDetail("cashOnArrival")}</p>
          <Button href={`/bookings/new?type=hotel&id=${hotel.id}`} className="mt-5 w-full">
            <CalendarCheck className="size-5" aria-hidden />
            {tDetail("book")}
          </Button>
        </GlassPanel>
      </div>
    </>
  );
}
