"use client";

import {
  ArrowLeft,
  BadgeCheck,
  CalendarCheck,
  Languages,
  MapPin,
  Navigation,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ListingGallery } from "@/components/listings/ListingGallery";
import { ListingLocationMap } from "@/components/maps/ListingLocationMap";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { StarRating } from "@/components/ui/StarRating";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import { useGuide } from "@/hooks/useGuides";
import type { Locale } from "@/i18n/config";
import { localizedName } from "@/lib/i18n/localized";

export function GuideDetail({
  guideId,
  basePath = "/guides",
}: {
  guideId: string;
  basePath?: string;
}): ReactNode {
  const t = useTranslations("guides");
  const td = useTranslations("guides.detail");
  const tGov = useTranslations("landing.governorates");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const formatMoney = useFormatSyp();
  const query = useGuide(guideId);
  if (query.isPending)
    return (
      <div className="space-y-6">
        <Skeleton className="aspect-[16/7]" />
        <Skeleton className="h-96" />
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
        icon={BadgeCheck}
        title={t("states.notFoundTitle")}
        description={t("states.notFoundDescription")}
        action={
          <Button href={basePath} variant="outline">
            {td("back")}
          </Button>
        }
      />
    );
  const guide = query.data;
  const name = localizedName(guide.name, loc);
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${guide.coordinates.latitude},${guide.coordinates.longitude}`;
  return (
    <>
      <Button href={basePath} variant="glass" size="sm" className="mb-5 w-fit">
        <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
        {td("back")}
      </Button>
      <ListingGallery
        images={guide.gallery}
        imageAlt={td("galleryImage", { guide: name })}
        openImageLabel={(number) => td("openImage", { number })}
      />
      <div className="mt-7 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-7">
          <section>
            <div className="flex flex-wrap gap-2">
              <Badge variant="solid" icon={<ShieldCheck className="size-3.5" aria-hidden />}>
                {t("verified")}
              </Badge>
              <Badge icon={<MapPin className="size-3.5" aria-hidden />}>
                {tGov(guide.governorate)}
              </Badge>
              <Badge>{td("license", { number: guide.licenseNumber })}</Badge>
            </div>
            <h1 className="font-heading text-prose mt-4 text-4xl font-semibold lg:text-5xl">
              {name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <StarRating
                value={guide.rating}
                size="md"
                label={t("ratingLabel", { rating: guide.rating })}
              />
              <span className="text-prose font-semibold">{guide.rating.toFixed(1)}</span>
              <span className="text-prose-muted">
                {t("reviewsCount", { count: guide.reviewCount })}
              </span>
              <span className="text-prose-muted">
                · {t("experience", { count: guide.yearsExperience })}
              </span>
            </div>
          </section>
          <GlassPanel className="p-6 sm:p-7">
            <h2 className="font-heading text-prose text-2xl font-semibold">{td("about")}</h2>
            <p className="text-prose-muted mt-3 leading-7">
              {localizedName(guide.description, loc)}
            </p>
          </GlassPanel>
          <div className="grid gap-7 md:grid-cols-2">
            <GlassPanel className="p-6">
              <h2 className="font-heading text-prose flex items-center gap-2 text-xl font-semibold">
                <Languages className="text-primary size-5" aria-hidden />
                {td("languages")}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {guide.languages.map((item) => (
                  <Badge key={item}>{t(`languages.${item}`)}</Badge>
                ))}
              </div>
            </GlassPanel>
            <GlassPanel className="p-6">
              <h2 className="font-heading text-prose flex items-center gap-2 text-xl font-semibold">
                <Sparkles className="text-primary size-5" aria-hidden />
                {td("specialties")}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {guide.specialties.map((item) => (
                  <Badge key={item}>{t(`specialties.${item}`)}</Badge>
                ))}
              </div>
            </GlassPanel>
          </div>
          <GlassPanel className="p-6 sm:p-7">
            <h2 className="font-heading text-prose text-2xl font-semibold">{td("rates")}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {(["hourly", "halfDay", "fullDay"] as const).map((duration) => (
                <div key={duration} className="bg-glass-control rounded-2xl p-5">
                  <p className="text-prose-muted text-sm">{t(`durations.${duration}`)}</p>
                  <p className="text-prose mt-2 text-lg font-semibold">
                    {formatMoney(guide.rates[duration])}
                  </p>
                </div>
              ))}
            </div>
          </GlassPanel>
          <GlassPanel className="p-6">
            <h2 className="font-heading text-prose text-xl font-semibold">{td("meetingArea")}</h2>
            <ListingLocationMap
              latitude={guide.coordinates.latitude}
              longitude={guide.coordinates.longitude}
              label={`${td("meetingArea")}: ${name}`}
            />
            <p className="text-prose mt-3 text-sm font-semibold">
              {localizedName(guide.address, loc)}
            </p>
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
          <GlassPanel className="p-6 sm:p-7">
            <h2 className="font-heading text-prose text-2xl font-semibold">{td("reviews")}</h2>
            {guide.reviews.length ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {guide.reviews.map((review) => (
                  <article key={review.id} className="bg-glass-control rounded-2xl p-4">
                    <div className="flex justify-between gap-3">
                      <p className="text-prose font-semibold">{review.guestName}</p>
                      <StarRating
                        value={review.rating}
                        label={t("ratingLabel", { rating: review.rating })}
                      />
                    </div>
                    <p className="text-prose-muted mt-3 text-sm">
                      {localizedName(review.comment, loc)}
                    </p>
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
          <p className="text-prose mt-1 text-xl font-semibold">{formatMoney(guide.rates.hourly)}</p>
          <p className="text-prose-muted text-xs">{t("perHour")}</p>
          <div className="border-border my-5 border-t" />
          <p className="text-prose-muted text-sm leading-relaxed">{td("cashOnArrival")}</p>
          <Button href={`/bookings/new?type=guide&id=${guide.id}`} className="mt-5 w-full">
            <CalendarCheck className="size-5" aria-hidden />
            {td("book")}
          </Button>
        </GlassPanel>
      </div>
    </>
  );
}
