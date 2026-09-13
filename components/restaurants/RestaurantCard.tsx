"use client";

import { ArrowUpRight, MapPin, ShieldCheck, UsersRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { RestaurantAmenityList } from "@/components/restaurants/RestaurantAmenityList";
import { Badge } from "@/components/ui/Badge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StarRating } from "@/components/ui/StarRating";
import type { Locale } from "@/i18n/config";
import { formatSyp } from "@/lib/format/money";
import { localizedName } from "@/lib/i18n/localized";
import type { Restaurant } from "@/lib/mock/restaurants";

export function RestaurantCard({ restaurant, detailBasePath = "/restaurants" }: { restaurant: Restaurant; detailBasePath?: string }): ReactNode {
  const t = useTranslations("restaurants");
  const tGov = useTranslations("landing.governorates");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const lowestPrice = Math.min(...restaurant.zones.map((zone) => zone.pricePerGuestSyp));
  const maxParty = Math.max(...restaurant.zones.map((zone) => zone.capacity));

  return (
    <article className="group h-full min-w-0 transition duration-300 ease-out hover:-translate-y-1">
      <Link href={`${detailBasePath}/${restaurant.id}`} className="block h-full min-w-0">
        <GlassPanel frost={false} className="h-full transition duration-300 group-hover:ring-1 group-hover:ring-primary/40">
          <div className="relative aspect-4/3 overflow-hidden rounded-t-[inherit]">
            <Image src={restaurant.imageSrc} alt={localizedName(restaurant.name, loc)} fill sizes="(min-width: 1280px) 29vw, (min-width: 768px) 45vw, 92vw" className="object-cover transition duration-500 group-hover:scale-105" />
            <div aria-hidden className="from-ink/65 absolute inset-x-0 top-0 h-24 bg-linear-to-b to-transparent" />
            {restaurant.verified ? <Badge variant="glass" icon={<ShieldCheck className="size-3.5" aria-hidden />} className="text-foam absolute start-3 top-3">{t("verified")}</Badge> : null}
          </div>
          <div className="flex flex-1 flex-col p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0"><h2 className="font-heading text-prose text-xl font-semibold">{localizedName(restaurant.name, loc)}</h2><p className="text-prose-muted mt-1 flex items-center gap-1.5 text-sm"><MapPin className="size-4 shrink-0" aria-hidden />{tGov(restaurant.governorate)}</p></div>
              <ArrowUpRight className="text-primary size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5" aria-hidden />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm"><StarRating value={restaurant.rating} label={t("ratingLabel", { rating: restaurant.rating })} /><span className="text-prose font-semibold">{restaurant.rating.toFixed(1)}</span><span className="text-prose-muted">{t("reviewsCount", { count: restaurant.reviewCount })}</span></div>
            <p className="text-primary mt-3 text-xs font-semibold">{localizedName(restaurant.cuisine, loc)}</p>
            <p className="text-prose-muted mt-2 line-clamp-2 text-sm leading-relaxed">{localizedName(restaurant.shortDescription, loc)}</p>
            <div className="mt-4"><RestaurantAmenityList amenities={restaurant.amenities} compact /></div>
            <div className="border-border mt-auto flex items-end justify-between gap-4 border-t pt-4"><div><p className="text-prose-muted text-xs">{t("from")}</p><p className="text-prose text-sm font-semibold">{formatSyp(lowestPrice, loc)}</p><p className="text-prose-muted text-xs">{t("perGuest")}</p></div><span className="text-prose-muted inline-flex items-center gap-1 text-xs"><UsersRound className="size-4" aria-hidden />{t("partyUpTo", { count: maxParty })}</span></div>
          </div>
        </GlassPanel>
      </Link>
    </article>
  );
}
