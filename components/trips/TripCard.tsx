"use client";

import { ArrowUpRight, CalendarDays, Clock3, MapPin, ShieldCheck, UsersRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { TripGearList } from "@/components/trips/TripGearList";
import { SavePlaceButton } from "@/components/saved/SavePlaceButton";
import { Badge } from "@/components/ui/Badge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StarRating } from "@/components/ui/StarRating";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import { formatSyp } from "@/lib/format/money";
import { localizedName } from "@/lib/i18n/localized";
import type { Trip } from "@/lib/mock/trips";

export function TripCard({ trip, detailBasePath = "/trips" }: { trip: Trip; detailBasePath?: string }): ReactNode {
  const t = useTranslations("trips");
  const tGov = useTranslations("landing.governorates");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const nextDeparture = trip.departures[0];

  return (
    <article className="group relative h-full min-w-0 transition duration-300 ease-out hover:-translate-y-1">
      <Link href={`${detailBasePath}/${trip.id}`} className="block h-full min-w-0">
        <GlassPanel frost={false} className="h-full transition duration-300 group-hover:ring-1 group-hover:ring-primary/40">
          <div className="relative aspect-4/3 overflow-hidden rounded-t-[inherit]">
            <Image src={trip.imageSrc} alt={localizedName(trip.name, loc)} fill sizes="(min-width: 1280px) 29vw, (min-width: 768px) 45vw, 92vw" className="object-cover transition duration-500 group-hover:scale-105" />
            <div aria-hidden className="from-ink/70 absolute inset-x-0 top-0 h-28 bg-linear-to-b to-transparent" />
            <div className="absolute start-3 top-3 flex flex-wrap gap-2">
              {trip.verified ? <Badge variant="glass" icon={<ShieldCheck className="size-3.5" aria-hidden />} className="text-foam">{t("verified")}</Badge> : null}
              <Badge variant="glass" icon={<Clock3 className="size-3.5" aria-hidden />} className="text-foam">{t(`durations.${trip.duration}`)}</Badge>
            </div>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0"><h2 className="font-heading text-prose text-xl font-semibold">{localizedName(trip.name, loc)}</h2><p className="text-prose-muted mt-1 flex items-center gap-1.5 text-sm"><MapPin className="size-4 shrink-0" aria-hidden />{tGov(trip.governorate)}</p></div>
              <ArrowUpRight className="text-primary size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5" aria-hidden />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm"><StarRating value={trip.rating} label={t("ratingLabel", { rating: trip.rating })} /><span className="text-prose font-semibold">{trip.rating.toFixed(1)}</span><span className="text-prose-muted">{t("reviewsCount", { count: trip.reviewCount })}</span></div>
            <p className="text-prose-muted mt-3 line-clamp-2 text-sm leading-relaxed">{localizedName(trip.shortDescription, loc)}</p>
            <div className="mt-4"><TripGearList gear={trip.gear} compact /></div>
            <div className="border-border mt-auto grid grid-cols-2 gap-3 border-t pt-4 text-sm">
              <div><p className="text-prose-muted flex items-center gap-1.5 text-xs"><CalendarDays className="size-3.5" aria-hidden />{t("nextDeparture")}</p><p className="text-prose mt-1 font-semibold">{nextDeparture ? formatMediumDate(nextDeparture.date, loc) : t("soldOut")}</p></div>
              <div className="text-end"><p className="text-prose-muted flex items-center justify-end gap-1.5 text-xs"><UsersRound className="size-3.5" aria-hidden />{nextDeparture ? t("seatsLeft", { count: nextDeparture.seatsLeft }) : t("soldOut")}</p><p className="text-prose mt-1 font-semibold">{formatSyp(trip.pricePerSeatSyp, loc)}</p><p className="text-prose-muted text-xs">{t("perPerson")}</p></div>
            </div>
          </div>
        </GlassPanel>
      </Link>
      {detailBasePath.startsWith("/user") ? <SavePlaceButton className="absolute end-3 top-3 z-10" place={{ id: trip.id, category: "trips", name: trip.name, governorate: trip.governorate, imageSrc: trip.imageSrc, href: `${detailBasePath}/${trip.id}` }} /> : null}
    </article>
  );
}
