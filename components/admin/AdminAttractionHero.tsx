"use client";

import { Clock, Globe, MapPin, Tag, Ticket } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { Locale } from "@/i18n/config";
import { formatPickerTime } from "@/lib/format/datetime";
import { formatSyp } from "@/lib/format/money";
import { localizedName } from "@/lib/i18n/localized";
import type { AdminAttraction } from "@/lib/mock/adminAttractions";

type AdminAttractionHeroProps = {
  attraction: AdminAttraction;
};

export function AdminAttractionHero({ attraction }: AdminAttractionHeroProps): ReactNode {
  const t = useTranslations("admin.attractions");
  const tGov = useTranslations("landing.governorates");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const otherLocale: Locale = locale === "ar" ? "en" : "ar";

  const primaryName = localizedName(attraction.name, loc);
  const secondaryName = localizedName(attraction.name, otherLocale);

  const formattedHours = `${formatPickerTime(attraction.opensAt, loc, "24")} – ${formatPickerTime(attraction.closesAt, loc, "24")}`;
  const formattedFee =
    attraction.entryFeeSyp > 0 ? formatSyp(attraction.entryFeeSyp, locale) : t("free");

  return (
    <GlassPanel className="relative overflow-hidden p-6 sm:p-8">
      <div className="pointer-events-none absolute -inset-e-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={attraction.published ? "solid" : "outline"}
              className={
                attraction.published
                  ? "bg-success text-success-foreground"
                  : "border-warning/60 text-warning"
              }
            >
              {attraction.published ? t("status.published") : t("status.draft")}
            </Badge>

            <span className="border-glass-border bg-glass-control text-prose flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium">
              <MapPin className="text-primary size-3.5" aria-hidden />
              <span>{tGov(attraction.governorate)}</span>
            </span>

            <span className="border-glass-border/60 text-prose-muted flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-mono">
              <Tag className="size-3" aria-hidden />
              <span>#{attraction.slug}</span>
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-prose text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {primaryName}
            </h1>
            {secondaryName !== primaryName ? (
              <p className="text-prose-muted flex items-center gap-1.5 text-sm sm:text-base">
                <Globe className="size-3.5 shrink-0 opacity-70" aria-hidden />
                <span>{secondaryName}</span>
              </p>
            ) : null}
          </div>

          <div className="border-glass-border/70 mt-1 flex flex-wrap items-center gap-4 border-t pt-3 sm:gap-6">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Clock className="text-primary size-4" aria-hidden />
              <span className="text-prose-muted font-medium">{t("columns.hours")}:</span>
              <span className="text-prose font-semibold tabular-nums">{formattedHours}</span>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Ticket className="text-primary size-4" aria-hidden />
              <span className="text-prose-muted font-medium">{t("columns.fee")}:</span>
              <span className="text-prose font-semibold tabular-nums">{formattedFee}</span>
            </div>
          </div>
        </div>

        <div className="border-glass-border relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl border bg-ink/10 shadow-lg sm:max-w-xs lg:w-72">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={attraction.imageSrc}
            alt={primaryName}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        </div>
      </div>
    </GlassPanel>
  );
}
