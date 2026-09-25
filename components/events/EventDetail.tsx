"use client";

import {
  ArrowLeft,
  CalendarCheck,
  CalendarDays,
  CalendarHeart,
  Clock3,
  MapPin,
  Navigation,
  ShieldCheck,
  Sparkles,
  Ticket,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { EventFeatureList } from "@/components/events/EventFeatureList";
import { ListingGallery } from "@/components/listings/ListingGallery";
import { ListingLocationMap } from "@/components/maps/ListingLocationMap";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { StarRating } from "@/components/ui/StarRating";
import { useEvent } from "@/hooks/useEvents";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import { formatSyp } from "@/lib/format/money";
import { localizedName } from "@/lib/i18n/localized";

export function EventDetail({
  eventId,
  basePath = "/events",
}: {
  eventId: string;
  basePath?: string;
}): ReactNode {
  const t = useTranslations("events");
  const td = useTranslations("events.detail");
  const tt = useTranslations("events.tiers");
  const tGov = useTranslations("landing.governorates");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const query = useEvent(eventId);
  if (query.isPending)
    return (
      <div className="space-y-6">
        <Skeleton className="aspect-[16/7]" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <Skeleton className="h-96" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  if (query.isError)
    return (
      <ErrorState
        title={t("states.detailErrorTitle")}
        description={t("states.errorDescription")}
        retryLabel={t("states.retry")}
        onRetry={() => void query.refetch()}
      />
    );
  if (!query.data)
    return (
      <EmptyState
        icon={CalendarHeart}
        title={t("states.notFoundTitle")}
        description={t("states.notFoundDescription")}
        action={
          <Button href={basePath} variant="outline" size="sm">
            {td("back")}
          </Button>
        }
      />
    );
  const event = query.data;
  const name = localizedName(event.name, loc);
  const nextSession = event.sessions[0];
  const lowestPrice = Math.min(
    ...event.sessions.flatMap((session) => session.tiers.map((tier) => tier.priceSyp)),
  );
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${event.coordinates.latitude},${event.coordinates.longitude}`;
  const bookingHref = `/bookings/new?type=event&id=${event.id}${nextSession ? `&session=${nextSession.id}` : ""}`;

  return (
    <>
      <Button href={basePath} variant="glass" size="sm" className="mb-5 w-fit">
        <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
        {td("back")}
      </Button>
      <ListingGallery
        images={event.gallery}
        imageAlt={td("galleryImage", { event: name })}
        openImageLabel={(number) => td("openImage", { number })}
      />
      <div className="mt-7 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-7">
          <section>
            <div className="flex flex-wrap items-center gap-2">
              {event.verified ? (
                <Badge variant="solid" icon={<ShieldCheck className="size-3.5" aria-hidden />}>
                  {t("verified")}
                </Badge>
              ) : null}
              <Badge icon={<MapPin className="size-3.5" aria-hidden />}>
                {tGov(event.governorate)}
              </Badge>
              <Badge>{t(`categories.${event.category}`)}</Badge>
            </div>
            <h1 className="font-heading text-prose mt-4 text-3xl font-semibold sm:text-4xl lg:text-5xl">
              {name}
            </h1>
            <p className="text-primary mt-2 text-sm font-semibold">
              {localizedName(event.providerName, loc)}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <StarRating
                value={event.rating}
                size="md"
                label={t("ratingLabel", { rating: event.rating })}
              />
              <span className="text-prose font-semibold">{event.rating.toFixed(1)}</span>
              <span className="text-prose-muted">
                {t("reviewsCount", { count: event.reviewCount })}
              </span>
              <span className="text-prose-muted" aria-hidden>
                ·
              </span>
              <span className="text-prose-muted">{localizedName(event.venue, loc)}</span>
            </div>
          </section>
          <GlassPanel className="p-6 sm:p-7">
            <h2 className="font-heading text-prose text-2xl font-semibold">{td("about")}</h2>
            <p className="text-prose-muted mt-3 leading-7">
              {localizedName(event.description, loc)}
            </p>
          </GlassPanel>
          <GlassPanel className="p-6 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-primary text-xs font-bold uppercase tracking-[0.14em]">
                  {td("sessionsEyebrow")}
                </p>
                <h2 className="font-heading text-prose mt-2 text-2xl font-semibold">
                  {td("sessions")}
                </h2>
              </div>
              <Badge icon={<CalendarDays className="size-3.5" aria-hidden />}>
                {t("sessionCount", { count: event.sessions.length })}
              </Badge>
            </div>
            <div className="mt-6 space-y-4">
              {event.sessions.map((session) => (
                <article key={session.id} className="bg-glass-control rounded-2xl p-5">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-prose flex items-center gap-2 font-semibold">
                        <CalendarDays className="text-accent size-4" aria-hidden />
                        {formatMediumDate(session.date, loc)}
                      </p>
                      <p className="text-prose-muted mt-1 flex items-center gap-2 text-sm">
                        <Clock3 className="size-4" aria-hidden />
                        {session.startsAt}–{session.endsAt}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {session.tiers.map((tier) => (
                        <Badge key={tier.id} icon={<Ticket className="size-3.5" aria-hidden />}>
                          {tt(tier.id)} · {t("ticketsLeft", { count: tier.remaining })}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </GlassPanel>
          <GlassPanel className="p-6 sm:p-7">
            <h2 className="font-heading text-prose text-2xl font-semibold">{td("tickets")}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {event.sessions[0]?.tiers.map((tier) => (
                <article key={tier.id} className="bg-glass-control rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-prose font-semibold">{tt(tier.id)}</h3>
                      <p className="text-prose-muted mt-1 text-sm">
                        {t("ticketsLeft", { count: tier.remaining })}
                      </p>
                    </div>
                    <p className="text-prose font-semibold">{formatSyp(tier.priceSyp, loc)}</p>
                  </div>
                  <ul className="text-prose-muted mt-4 space-y-2 text-sm">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit.en} className="flex gap-2">
                        <Sparkles className="text-accent mt-0.5 size-4 shrink-0" aria-hidden />
                        {localizedName(benefit, loc)}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </GlassPanel>
          <div className="grid gap-7 md:grid-cols-2">
            <GlassPanel className="p-6">
              <h2 className="font-heading text-prose text-xl font-semibold">{td("experience")}</h2>
              <ul className="text-prose-muted mt-4 space-y-3 text-sm">
                {event.highlights.map((highlight) => (
                  <li key={highlight.en} className="flex gap-2">
                    <Sparkles className="text-accent mt-0.5 size-4 shrink-0" aria-hidden />
                    {localizedName(highlight, loc)}
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <EventFeatureList features={event.features} />
              </div>
            </GlassPanel>
            <GlassPanel className="p-6">
              <h2 className="font-heading text-prose text-xl font-semibold">{td("venue")}</h2>
              <ListingLocationMap
                latitude={event.coordinates.latitude}
                longitude={event.coordinates.longitude}
                label={`${td("venue")}: ${name}`}
              />
              <p className="text-prose mt-3 text-sm font-semibold">
                {localizedName(event.venue, loc)}
              </p>
              <p className="text-prose-muted mt-1 text-sm">{localizedName(event.address, loc)}</p>
              <a
                href={mapHref}
                target="_blank"
                rel="noreferrer"
                className="text-primary mt-3 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
              >
                <Navigation className="size-4" aria-hidden />
                {td("navigate")}
              </a>
            </GlassPanel>
          </div>
          <GlassPanel className="p-6 sm:p-7">
            <h2 className="font-heading text-prose text-2xl font-semibold">{td("reviews")}</h2>
            {event.reviews.length ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {event.reviews.map((review) => (
                  <article key={review.id} className="bg-glass-control rounded-2xl p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-prose font-semibold">{review.guestName}</p>
                      <StarRating
                        value={review.rating}
                        label={t("ratingLabel", { rating: review.rating })}
                      />
                    </div>
                    <p className="text-prose-muted mt-3 text-sm leading-relaxed">
                      {localizedName(review.comment, loc)}
                    </p>
                    <time dateTime={review.date} className="text-prose-muted mt-3 block text-xs">
                      {review.date}
                    </time>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-prose-muted mt-3 text-sm">{td("noReviews")}</p>
            )}
          </GlassPanel>
        </div>
        <GlassPanel className="p-6 lg:sticky lg:top-28">
          <p className="text-prose-muted text-sm">{t("from")}</p>
          <p className="text-prose mt-1 text-xl font-semibold">{formatSyp(lowestPrice, loc)}</p>
          <p className="text-prose-muted text-xs">{t("perTicket")}</p>
          <div className="border-border my-5 border-t" />
          {nextSession ? (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-prose-muted">{td("nextDate")}</dt>
                <dd className="text-prose text-end font-semibold">
                  {formatMediumDate(nextSession.date, loc)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-prose-muted">{td("time")}</dt>
                <dd className="text-prose font-semibold">{nextSession.startsAt}</dd>
              </div>
            </dl>
          ) : null}
          <p className="text-prose-muted mt-5 text-sm leading-relaxed">{td("cashOnArrival")}</p>
          <Button href={bookingHref} className="mt-5 w-full" disabled={!nextSession}>
            <CalendarCheck className="size-5" aria-hidden />
            {td("book")}
          </Button>
        </GlassPanel>
      </div>
    </>
  );
}
