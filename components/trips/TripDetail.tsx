"use client";

import { ArrowLeft, CalendarCheck, CalendarDays, Clock3, Compass, MapPin, Navigation, ShieldCheck, UsersRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ListingGallery } from "@/components/listings/ListingGallery";
import { ListingLocationMap } from "@/components/maps/ListingLocationMap";
import { TripGearList } from "@/components/trips/TripGearList";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { StarRating } from "@/components/ui/StarRating";
import { PAGE_TITLE_CLASS } from "@/components/ui/pageTitle";
import { useTrip } from "@/hooks/useTrips";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { formatMediumDate } from "@/lib/format/datetime";
import { formatSyp } from "@/lib/format/money";
import { localizedName } from "@/lib/i18n/localized";

export function TripDetail({ tripId, basePath = "/trips" }: { tripId: string; basePath?: string }): ReactNode {
  const t = useTranslations("trips");
  const td = useTranslations("trips.detail");
  const tGov = useTranslations("landing.governorates");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const query = useTrip(tripId);

  if (query.isPending) return <div className="space-y-6"><Skeleton className="aspect-[16/7]" /><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"><Skeleton className="h-96" /><Skeleton className="h-80" /></div></div>;
  if (query.isError) return <ErrorState title={t("states.detailErrorTitle")} description={t("states.errorDescription")} retryLabel={t("states.retry")} onRetry={() => void query.refetch()} />;
  if (!query.data) return <EmptyState icon={Compass} title={t("states.notFoundTitle")} description={t("states.notFoundDescription")} action={<Button href={basePath} variant="outline" size="sm">{td("back")}</Button>} />;

  const trip = query.data;
  const name = localizedName(trip.name, loc);
  const nextDeparture = trip.departures[0];
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${trip.coordinates.latitude},${trip.coordinates.longitude}`;
  const bookingHref = `/bookings/new?type=trip&id=${trip.id}${nextDeparture ? `&date=${nextDeparture.date}` : ""}`;

  return (
    <>
      <Button href={basePath} variant="glass" size="sm" className="mb-5 w-fit"><ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />{td("back")}</Button>
      <ListingGallery images={trip.gallery} imageAlt={td("galleryImage", { trip: name })} openImageLabel={(number) => td("openImage", { number })} />
      <div className="mt-7 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-7">
          <section>
            <div className="flex flex-wrap items-center gap-2">{trip.verified ? <Badge variant="solid" icon={<ShieldCheck className="size-3.5" aria-hidden />}>{t("verified")}</Badge> : null}<Badge icon={<MapPin className="size-3.5" aria-hidden />}>{tGov(trip.governorate)}</Badge><Badge icon={<Clock3 className="size-3.5" aria-hidden />}>{t(`durations.${trip.duration}`)} · {localizedName(trip.durationDetail, loc)}</Badge></div>
            <h1 className={cn(PAGE_TITLE_CLASS, "mt-4")}>{name}</h1>
            <p className="text-primary mt-2 text-sm font-semibold">{localizedName(trip.providerName, loc)}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm"><StarRating value={trip.rating} size="md" label={t("ratingLabel", { rating: trip.rating })} /><span className="text-prose font-semibold">{trip.rating.toFixed(1)}</span><span className="text-prose-muted">{t("reviewsCount", { count: trip.reviewCount })}</span><span className="text-prose-muted" aria-hidden>·</span><span className="text-prose-muted">{localizedName(trip.address, loc)}</span></div>
          </section>

          <GlassPanel className="p-6 sm:p-7"><h2 className="font-heading text-prose text-2xl font-semibold">{td("about")}</h2><p className="text-prose-muted mt-3 leading-7">{localizedName(trip.description, loc)}</p></GlassPanel>

          <GlassPanel className="p-6 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-primary text-xs font-bold uppercase tracking-[0.14em]">{td("routeEyebrow")}</p><h2 className="font-heading text-prose mt-2 text-2xl font-semibold">{td("itinerary")}</h2></div><Badge icon={<Clock3 className="size-3.5" aria-hidden />}>{localizedName(trip.durationDetail, loc)}</Badge></div>
            <ol className="mt-6 space-y-1">{trip.itinerary.map((item, index) => <li key={item.id} className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 pb-6 last:pb-0"><div className="relative"><span className="bg-primary text-primary-foreground relative z-10 grid size-11 place-items-center rounded-full text-sm font-bold">{index + 1}</span>{index < trip.itinerary.length - 1 ? <span aria-hidden className="bg-border absolute start-1/2 top-11 h-[calc(100%-1.25rem)] w-px -translate-x-1/2" /> : null}</div><div className="pt-1"><p className="text-primary text-xs font-semibold uppercase tracking-wider">{item.time}</p><h3 className="text-prose mt-1 font-semibold">{localizedName(item.title, loc)}</h3><p className="text-prose-muted mt-1 text-sm leading-relaxed">{localizedName(item.description, loc)}</p></div></li>)}</ol>
          </GlassPanel>

          <div className="grid gap-7 md:grid-cols-2">
            <GlassPanel className="p-6"><h2 className="font-heading text-prose text-xl font-semibold">{td("departures")}</h2><div className="mt-4 space-y-3">{trip.departures.map((departure) => <div key={departure.date} className="bg-glass-control flex items-center justify-between gap-3 rounded-2xl p-4"><p className="text-prose flex items-center gap-2 text-sm font-semibold"><CalendarDays className="text-accent size-4" aria-hidden />{formatMediumDate(departure.date, loc)}</p><Badge>{t("seatsLeft", { count: departure.seatsLeft })}</Badge></div>)}</div></GlassPanel>
            <GlassPanel className="p-6"><h2 className="font-heading text-prose text-xl font-semibold">{td("pickupPoints")}</h2><div className="mt-4 space-y-3">{trip.pickupPoints.map((point) => <div key={point.id} className="bg-glass-control rounded-2xl p-4"><p className="text-prose font-semibold">{localizedName(point.name, loc)}</p><p className="text-prose-muted mt-1 flex items-center gap-2 text-sm"><Clock3 className="size-4" aria-hidden />{point.time}</p></div>)}</div></GlassPanel>
          </div>

          <div className="grid gap-7 md:grid-cols-2">
            <GlassPanel className="p-6"><h2 className="font-heading text-prose text-xl font-semibold">{td("included")}</h2><div className="mt-4"><TripGearList gear={trip.gear} /></div></GlassPanel>
            <GlassPanel className="p-6"><h2 className="font-heading text-prose text-xl font-semibold">{td("meetingPoint")}</h2><ListingLocationMap latitude={trip.coordinates.latitude} longitude={trip.coordinates.longitude} label={`${td("meetingPoint")}: ${name}`} /><p className="text-prose-muted mt-3 text-sm">{localizedName(trip.address, loc)}</p><a href={mapHref} target="_blank" rel="noreferrer" className="text-primary mt-3 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"><Navigation className="size-4" aria-hidden />{td("navigate")}</a></GlassPanel>
          </div>

          <GlassPanel className="p-6 sm:p-7"><h2 className="font-heading text-prose text-2xl font-semibold">{td("reviews")}</h2>{trip.reviews.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2">{trip.reviews.map((review) => <article key={review.id} className="bg-glass-control rounded-2xl p-4"><div className="flex items-center justify-between gap-3"><p className="text-prose font-semibold">{review.guestName}</p><StarRating value={review.rating} label={t("ratingLabel", { rating: review.rating })} /></div><p className="text-prose-muted mt-3 text-sm leading-relaxed">{localizedName(review.comment, loc)}</p><time dateTime={review.date} className="text-prose-muted mt-3 block text-xs">{review.date}</time></article>)}</div> : <p className="text-prose-muted mt-3 text-sm">{td("noReviews")}</p>}</GlassPanel>
        </div>

        <GlassPanel className="p-6 lg:sticky lg:top-28">
          <p className="text-prose-muted text-sm">{t("from")}</p><p className="text-prose mt-1 text-xl font-semibold">{formatSyp(trip.pricePerSeatSyp, loc)}</p><p className="text-prose-muted text-xs">{t("perPerson")}</p>
          <div className="border-border my-5 border-t" />
          <dl className="space-y-3 text-sm"><div className="flex justify-between gap-3"><dt className="text-prose-muted">{td("capacity")}</dt><dd className="text-prose flex items-center gap-1.5 font-semibold"><UsersRound className="size-4" aria-hidden />{t("people", { count: trip.capacity })}</dd></div>{nextDeparture ? <div className="flex justify-between gap-3"><dt className="text-prose-muted">{td("nextDate")}</dt><dd className="text-prose font-semibold">{formatMediumDate(nextDeparture.date, loc)}</dd></div> : null}</dl>
          <p className="text-prose-muted mt-5 text-sm leading-relaxed">{td("cashOnArrival")}</p>
          <Button href={bookingHref} className="mt-5 w-full" disabled={!nextDeparture}><CalendarCheck className="size-5" aria-hidden />{td("book")}</Button>
        </GlassPanel>
      </div>
    </>
  );
}
