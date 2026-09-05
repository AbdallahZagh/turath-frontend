"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import type { ReactNode } from "react";

import { ADMIN_PATHS } from "@/config/adminRoutes";
import { AdminEditDeleteMenu } from "@/components/admin/AdminEditDeleteMenu";
import { AttractionCover } from "@/components/admin/AttractionCover";
import { Badge } from "@/components/ui/Badge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { Locale } from "@/i18n/config";
import { formatPickerTime } from "@/lib/format/datetime";
import { formatSyp } from "@/lib/format/money";
import { localizedName } from "@/lib/i18n/localized";
import type { AdminAttraction } from "@/lib/mock/adminAttractions";

type AdminAttractionCardProps = {
  attraction: AdminAttraction;
  onEdit: (attraction: AdminAttraction) => void;
  onDelete: (attraction: AdminAttraction) => void;
};

export function AdminAttractionCard({
  attraction,
  onEdit,
  onDelete,
}: AdminAttractionCardProps): ReactNode {
  const t = useTranslations("admin.attractions");
  const tGov = useTranslations("landing.governorates");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const hours = `${formatPickerTime(attraction.opensAt, loc, "24")}–${formatPickerTime(attraction.closesAt, loc, "24")}`;
  const fee =
    attraction.entryFeeSyp === 0 ? t("free") : formatSyp(attraction.entryFeeSyp, loc);

  return (
    <div className="group relative h-full min-w-0 transition duration-300 ease-out hover:-translate-y-1">
      <Link href={ADMIN_PATHS.heritageSite(attraction.id)} className="block h-full min-w-0">
        <GlassPanel frost={false} className="flex h-full flex-col transition duration-300 group-hover:ring-1 group-hover:ring-primary/40">
          <div className="relative aspect-16/10 overflow-hidden rounded-t-[inherit]">
            <AttractionCover
              src={attraction.imageSrc}
              alt={localizedName(attraction.name, loc)}
              sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 90vw"
              className="absolute inset-0 size-full transition duration-500 ease-out group-hover:scale-105"
            />
            <div
              aria-hidden
              className="from-ink/55 absolute inset-x-0 top-0 h-16 bg-linear-to-b to-transparent"
            />
            <Badge
              variant={attraction.published ? "solid" : "glass"}
              className="absolute inset-s-3 top-3"
            >
              {attraction.published ? t("status.published") : t("status.draft")}
            </Badge>
          </div>
          <div className="flex flex-1 flex-col gap-2 p-4">
            <h2 className="font-heading text-prose text-lg font-semibold tracking-tight">
              {localizedName(attraction.name, loc)}
            </h2>
            <p className="text-prose-muted text-xs font-medium tracking-wide uppercase">
              {tGov(attraction.governorate)}
            </p>
            <p className="text-prose-muted line-clamp-2 text-sm leading-relaxed">
              {localizedName(attraction.narrative, loc)}
            </p>
            <p className="text-prose mt-auto pt-2 text-sm">
              <span className="text-prose-muted">{hours}</span>
              <span aria-hidden className="text-prose-muted">
                {" · "}
              </span>
              {fee}
            </p>
          </div>
        </GlassPanel>
      </Link>
      <div className="absolute inset-e-3 top-3 z-10">
        <AdminEditDeleteMenu
          label={t("actionMenu", { name: localizedName(attraction.name, loc) })}
          editLabel={t("actionEdit")}
          deleteLabel={t("actionDelete")}
          onEdit={() => onEdit(attraction)}
          onDelete={() => onDelete(attraction)}
          triggerClassName="bg-ink/70 text-foam hover:bg-ink/90 hover:text-foam backdrop-blur-sm"
        />
      </div>
    </div>
  );
}
