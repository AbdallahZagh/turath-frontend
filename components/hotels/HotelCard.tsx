"use client";

import { ArrowUpRight, MapPin, ShieldCheck, UsersRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { HotelAmenityList } from "@/components/hotels/HotelAmenityList";
import { SavePlaceButton } from "@/components/saved/SavePlaceButton";
import { Badge } from "@/components/ui/Badge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StarRating } from "@/components/ui/StarRating";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import type { Locale } from "@/i18n/config";
import { localizedName } from "@/lib/i18n/localized";
import type { Hotel } from "@/lib/mock/hotels";

type HotelCardProps = {
  hotel: Hotel;
  detailBasePath?: string;
};

export function HotelCard({ hotel, detailBasePath = "/hotels" }: HotelCardProps): ReactNode {
  const t = useTranslations("hotels");
  const tGov = useTranslations("landing.governorates");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const formatMoney = useFormatSyp();
  const lowestPrice = Math.min(...hotel.rooms.map((room) => room.priceSyp));
  const maxGuests = Math.max(...hotel.rooms.map((room) => room.maxGuests));

  return (
    <article className="group relative h-full min-w-0 transition duration-300 ease-out hover:-translate-y-1">
      <Link href={`${detailBasePath}/${hotel.id}`} className="block h-full min-w-0">
        <GlassPanel
          frost={false}
          className="h-full transition duration-300 group-hover:ring-1 group-hover:ring-primary/40"
        >
          <div className="relative aspect-4/3 overflow-hidden rounded-t-[inherit]">
            <Image
              src={hotel.imageSrc}
              alt={localizedName(hotel.name, loc)}
              fill
              sizes="(min-width: 1280px) 29vw, (min-width: 768px) 45vw, 92vw"
              className="object-cover transition duration-500 ease-out group-hover:scale-105"
            />
            <div aria-hidden className="from-ink/65 absolute inset-x-0 top-0 h-24 bg-linear-to-b to-transparent" />
            {hotel.verified ? (
              <Badge
                variant="glass"
                icon={<ShieldCheck className="size-3.5" aria-hidden />}
                className="text-foam absolute top-3 start-3"
              >
                {t("verified")}
              </Badge>
            ) : null}
          </div>

          <div className="flex flex-1 flex-col p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-heading text-prose text-xl font-semibold tracking-tight">
                  {localizedName(hotel.name, loc)}
                </h2>
                <p className="text-prose-muted mt-1 flex items-center gap-1.5 text-sm">
                  <MapPin className="size-4 shrink-0" aria-hidden />
                  {tGov(hotel.governorate)}
                </p>
              </div>
              <ArrowUpRight className="text-primary size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5" aria-hidden />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <StarRating value={hotel.rating} label={t("ratingLabel", { rating: hotel.rating })} />
              <span className="text-prose font-semibold">{hotel.rating.toFixed(1)}</span>
              <span className="text-prose-muted">{t("reviewsCount", { count: hotel.reviewCount })}</span>
            </div>

            <p className="text-prose-muted mt-3 line-clamp-2 text-sm leading-relaxed">
              {localizedName(hotel.shortDescription, loc)}
            </p>

            <div className="mt-4">
              <HotelAmenityList amenities={hotel.amenities} compact />
            </div>

            <div className="border-border mt-auto flex items-end justify-between gap-4 border-t pt-4">
              <div>
                <p className="text-prose-muted text-xs">{t("from")}</p>
                <p className="text-prose text-sm font-semibold">{formatMoney(lowestPrice)}</p>
                <p className="text-prose-muted text-xs">{t("perNight")}</p>
              </div>
              <span className="text-prose-muted inline-flex items-center gap-1 text-xs">
                <UsersRound className="size-4" aria-hidden />
                {t("sleepsUpTo", { count: maxGuests })}
              </span>
            </div>
          </div>
        </GlassPanel>
      </Link>
      {detailBasePath.startsWith("/user") ? (
        <SavePlaceButton
          className="absolute end-3 top-3 z-10"
          place={{ id: hotel.id, category: "hotels", name: hotel.name, governorate: hotel.governorate, imageSrc: hotel.imageSrc, href: `${detailBasePath}/${hotel.id}` }}
        />
      ) : null}
    </article>
  );
}
