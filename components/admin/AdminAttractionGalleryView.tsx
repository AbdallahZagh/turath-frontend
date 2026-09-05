"use client";

import { ImageIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { GlassPanel } from "@/components/ui/GlassPanel";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { localizedName } from "@/lib/i18n/localized";
import type { AdminAttraction } from "@/lib/mock/adminAttractions";

type AdminAttractionGalleryViewProps = {
  attraction: AdminAttraction;
};

export function AdminAttractionGalleryView({
  attraction,
}: AdminAttractionGalleryViewProps): ReactNode {
  const t = useTranslations("admin.attractions");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const siteName = localizedName(attraction.name, loc);

  const allPhotos = [
    attraction.imageSrc,
    ...(attraction.gallery?.filter((src) => src !== attraction.imageSrc) ?? []),
  ];

  const [activePhoto, setActivePhoto] = useState(allPhotos[0]);

  const currentPhoto = allPhotos.includes(activePhoto) ? activePhoto : allPhotos[0];

  return (
    <GlassPanel className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="text-primary size-5" aria-hidden />
          <h2 className="font-heading text-prose text-lg font-semibold">
            {t("detail.galleryTitle")}
          </h2>
        </div>
        <span className="text-prose-muted border-glass-border/70 rounded-full border px-2.5 py-0.5 text-xs font-medium">
          {t("detail.galleryCount", { count: allPhotos.length })}
        </span>
      </div>

      <div className="border-glass-border relative aspect-video w-full overflow-hidden rounded-2xl border bg-ink/15 shadow-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentPhoto}
          alt={siteName}
          className="h-full w-full object-cover transition duration-300"
        />
      </div>

      {allPhotos.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1 pt-1">
          {allPhotos.map((photo, index) => {
            const isSelected = photo === currentPhoto;
            return (
              <button
                key={`${photo}-${index}`}
                type="button"
                onClick={() => setActivePhoto(photo)}
                className={cn(
                  "border-glass-border relative aspect-video h-16 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20",
                  isSelected
                    ? "border-primary scale-105 shadow-md ring-2 ring-primary/40"
                    : "opacity-70 hover:opacity-100 hover:border-prose/40",
                )}
                aria-label={t("detail.photoLabel", { n: index + 1 })}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="" className="h-full w-full object-cover" />
                {index === 0 ? (
                  <span className="bg-ink/80 text-foam absolute bottom-1 inset-s-1 rounded px-1.5 py-0.5 text-[10px] font-medium">
                    {t("detail.coverBadge")}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </GlassPanel>
  );
}
