"use client";

import { Clock, Landmark, Ticket } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { GlassPanel } from "@/components/ui/GlassPanel";
import type { Locale } from "@/i18n/config";
import { formatPickerTime } from "@/lib/format/datetime";
import { formatSyp } from "@/lib/format/money";
import type { AdminAttraction } from "@/lib/mock/adminAttractions";

type AdminAttractionLogisticsViewProps = {
  attraction: AdminAttraction;
};

export function AdminAttractionLogisticsView({
  attraction,
}: AdminAttractionLogisticsViewProps): ReactNode {
  const t = useTranslations("admin.attractions");
  const tGov = useTranslations("landing.governorates");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";

  const isAllDay =
    (attraction.opensAt === "00:00" && attraction.closesAt === "23:59") ||
    (attraction.opensAt === "00:00" && attraction.closesAt === "00:00");

  const formattedHours = isAllDay
    ? t("detail.allDay")
    : `${formatPickerTime(attraction.opensAt, loc, "24")} – ${formatPickerTime(attraction.closesAt, loc, "24")}`;

  const formattedFee =
    attraction.entryFeeSyp > 0 ? formatSyp(attraction.entryFeeSyp, locale) : t("detail.freeEntry");

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <GlassPanel className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl">
            <Clock className="size-4.5" aria-hidden />
          </div>
          <span className="text-prose-muted text-xs font-semibold uppercase tracking-wider">
            {t("detail.hours")}
          </span>
        </div>
        <p className="text-prose text-lg font-bold tabular-nums">{formattedHours}</p>
      </GlassPanel>

      <GlassPanel className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl">
            <Ticket className="size-4.5" aria-hidden />
          </div>
          <span className="text-prose-muted text-xs font-semibold uppercase tracking-wider">
            {t("detail.entryFee")}
          </span>
        </div>
        <p className="text-prose text-lg font-bold tabular-nums">{formattedFee}</p>
      </GlassPanel>

      <GlassPanel className="flex flex-col gap-3 p-5 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl">
            <Landmark className="size-4.5" aria-hidden />
          </div>
          <span className="text-prose-muted text-xs font-semibold uppercase tracking-wider">
            {t("detail.governorate")}
          </span>
        </div>
        <p className="text-prose text-lg font-bold">{tGov(attraction.governorate)}</p>
      </GlassPanel>
    </div>
  );
}
