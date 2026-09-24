"use client";

import { ArrowUpRight, MapPin, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import type { Locale } from "@/i18n/config";
import { localizedName } from "@/lib/i18n/localized";
import type { DiscoveryResult } from "@/services/discovery";

export function DiscoveryCard({ result, compact = false }: { result: DiscoveryResult; compact?: boolean }): ReactNode {
  const t = useTranslations("discovery"); const tGov = useTranslations("landing.governorates"); const locale = useLocale(); const loc: Locale = locale === "ar" ? "ar" : "en"; const formatMoney = useFormatSyp();
  return <article className="group h-full min-w-0"><Link href={result.detailHref} className="block h-full"><GlassPanel frost={false} className={`h-full overflow-hidden transition group-hover:ring-1 group-hover:ring-primary/40 ${compact ? "grid grid-cols-[7rem_minmax(0,1fr)]" : "flex flex-col"}`}><div className={`relative overflow-hidden ${compact ? "min-h-32" : "aspect-4/3"}`}><Image src={result.imageSrc} alt={localizedName(result.name, loc)} fill sizes={compact ? "7rem" : "(min-width:1280px) 25vw, (min-width:768px) 45vw, 92vw"} className="object-cover transition duration-500 group-hover:scale-105" /></div><div className="flex min-w-0 flex-1 flex-col p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><Badge>{t(`categories.${result.category}`)}</Badge><h2 className={`font-heading text-prose mt-2 truncate font-semibold ${compact ? "text-lg" : "text-xl"}`}>{localizedName(result.name, loc)}</h2><p className="text-prose-muted mt-1 flex items-center gap-1.5 text-xs"><MapPin className="size-3.5" aria-hidden />{tGov(result.governorate)}</p></div><ArrowUpRight className="text-primary size-5 shrink-0" aria-hidden /></div>{compact ? null : <p className="text-prose-muted mt-3 line-clamp-2 text-sm leading-relaxed">{localizedName(result.description, loc)}</p>}<div className="border-border mt-auto flex items-end justify-between gap-3 border-t pt-3"><div>{result.rating !== null ? <p className="text-prose flex items-center gap-1 text-sm font-semibold"><Star className="text-accent size-4 fill-current" aria-hidden />{result.rating.toFixed(1)}</p> : <p className="text-prose-muted text-xs">{t("heritageSite")}</p>}</div><div className="text-end"><p className="text-prose font-semibold">{result.priceSyp === 0 ? t("free") : formatMoney(result.priceSyp)}</p><p className="text-prose-muted text-[0.7rem]">{t(`priceUnits.${result.category}`)}</p></div></div></div></GlassPanel></Link></article>;
}
