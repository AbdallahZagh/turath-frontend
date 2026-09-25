"use client";

import { ArrowUpRight, BadgeCheck, Languages, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { SavePlaceButton } from "@/components/saved/SavePlaceButton";
import { Badge } from "@/components/ui/Badge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StarRating } from "@/components/ui/StarRating";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import type { Locale } from "@/i18n/config";
import { localizedName } from "@/lib/i18n/localized";
import type { TourGuide } from "@/lib/mock/guides";

export function GuideCard({ guide, detailBasePath = "/guides" }: { guide: TourGuide; detailBasePath?: string }): ReactNode {
  const t = useTranslations("guides");
  const tGov = useTranslations("landing.governorates");
  const loc: Locale = useLocale() === "ar" ? "ar" : "en";
  const formatMoney = useFormatSyp();
  const href = `${detailBasePath}/${guide.id}`;

  return (
    <article className="group relative h-full min-w-0 transition duration-300 hover:-translate-y-1">
      <Link href={href} className="block h-full">
        <GlassPanel frost={false} className="h-full transition group-hover:ring-1 group-hover:ring-primary/40">
          <div className="relative aspect-4/3 overflow-hidden rounded-t-[inherit]">
            <Image src={guide.imageSrc} alt={localizedName(guide.name, loc)} fill sizes="(min-width:1280px) 29vw, (min-width:768px) 45vw, 92vw" className="object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute start-3 top-3 flex gap-2">
              {guide.verified ? <Badge variant="glass" icon={<BadgeCheck className="size-3.5" aria-hidden />}>{t("verified")}</Badge> : null}
            </div>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <div className="flex items-start justify-between gap-4">
              <div><h2 className="font-heading text-prose text-xl font-semibold">{localizedName(guide.name, loc)}</h2><p className="text-prose-muted mt-1 flex items-center gap-1.5 text-sm"><MapPin className="size-4" aria-hidden />{tGov(guide.governorate)}</p></div>
              <ArrowUpRight className="text-primary size-5 shrink-0" aria-hidden />
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm"><StarRating value={guide.rating} label={t("ratingLabel", { rating: guide.rating })} /><span className="text-prose font-semibold">{guide.rating.toFixed(1)}</span><span className="text-prose-muted">{t("reviewsCount", { count: guide.reviewCount })}</span></div>
            <p className="text-prose-muted mt-3 line-clamp-2 text-sm leading-relaxed">{localizedName(guide.shortDescription, loc)}</p>
            <div className="mt-4 flex flex-wrap gap-2"><Badge icon={<Languages className="size-3.5" aria-hidden />}>{guide.languages.slice(0, 2).map((item) => t(`languages.${item}`)).join(" · ")}</Badge>{guide.specialties.slice(0, 2).map((item) => <Badge key={item}>{t(`specialties.${item}`)}</Badge>)}</div>
            <div className="border-border mt-auto flex items-end justify-between gap-3 border-t pt-4"><p className="text-prose-muted text-xs">{t("experience", { count: guide.yearsExperience })}</p><div className="text-end"><p className="text-prose font-semibold">{formatMoney(guide.rates.hourly)}</p><p className="text-prose-muted text-xs">{t("perHour")}</p></div></div>
          </div>
        </GlassPanel>
      </Link>
      {detailBasePath.startsWith("/user") ? <SavePlaceButton className="absolute end-3 top-3 z-10" place={{ id: guide.id, category: "guides", name: guide.name, governorate: guide.governorate, imageSrc: guide.imageSrc, href }} /> : null}
    </article>
  );
}
