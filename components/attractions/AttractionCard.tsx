"use client";

import { ArrowUpRight, Clock3, MapPin, Ticket } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import type { Locale } from "@/i18n/config";
import { formatPickerTime } from "@/lib/format/datetime";
import { localizedName } from "@/lib/i18n/localized";
import type { TouristAttraction } from "@/services/attractions";

export function AttractionCard({ attraction, detailBasePath = "/attractions" }: { attraction: TouristAttraction; detailBasePath?: string }): ReactNode {
  const t = useTranslations("attractions"); const tGov = useTranslations("landing.governorates"); const locale = useLocale(); const loc: Locale = locale === "ar" ? "ar" : "en"; const formatMoney = useFormatSyp();
  const allDay = attraction.opensAt === "00:00" && attraction.closesAt === "23:59";
  const hours = allDay ? t("allDay") : `${formatPickerTime(attraction.opensAt, loc, "24")}–${formatPickerTime(attraction.closesAt, loc, "24")}`;
  return <article className="group h-full min-w-0 transition duration-300 hover:-translate-y-1"><Link href={`${detailBasePath}/${attraction.slug}`} className="block h-full"><GlassPanel frost={false} className="flex h-full flex-col transition group-hover:ring-1 group-hover:ring-primary/40"><div className="relative aspect-4/3 overflow-hidden rounded-t-[inherit]"><Image src={attraction.imageSrc} alt={localizedName(attraction.name, loc)} fill sizes="(min-width:1280px) 29vw, (min-width:768px) 45vw, 92vw" className="object-cover transition duration-500 group-hover:scale-105" /><div aria-hidden className="from-ink/60 absolute inset-x-0 top-0 h-24 bg-linear-to-b to-transparent" /></div><div className="flex flex-1 flex-col p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="font-heading text-prose text-xl font-semibold">{localizedName(attraction.name, loc)}</h2><p className="text-prose-muted mt-1 flex items-center gap-1.5 text-sm"><MapPin className="size-4" aria-hidden />{tGov(attraction.governorate)}</p></div><ArrowUpRight className="text-primary size-5 shrink-0" aria-hidden /></div><p className="text-prose-muted mt-3 line-clamp-3 text-sm leading-relaxed">{localizedName(attraction.narrative, loc)}</p><div className="border-border mt-auto grid grid-cols-2 gap-3 border-t pt-4 text-sm"><div><p className="text-prose-muted flex items-center gap-1.5 text-xs"><Clock3 className="size-3.5" aria-hidden />{t("hours")}</p><p className="text-prose mt-1 font-semibold">{hours}</p></div><div className="text-end"><p className="text-prose-muted flex items-center justify-end gap-1.5 text-xs"><Ticket className="size-3.5" aria-hidden />{t("entryFee")}</p><p className="text-prose mt-1 font-semibold">{attraction.entryFeeSyp === 0 ? t("free") : formatMoney(attraction.entryFeeSyp)}</p></div></div></div></GlassPanel></Link></article>;
}
