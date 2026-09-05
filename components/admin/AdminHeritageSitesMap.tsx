"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Clock,
  Coins,
  Compass,
  Landmark,
  X,
} from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ADMIN_PATHS } from "@/config/adminRoutes";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { formatPickerTime } from "@/lib/format/datetime";
import { formatSyp } from "@/lib/format/money";
import { localizedName } from "@/lib/i18n/localized";
import type { AdminAttraction } from "@/lib/mock/adminAttractions";
import { GOVERNORATES, type GovernorateSlug } from "@/lib/mock/landing";

type AdminHeritageSitesMapProps = {
  attractions: AdminAttraction[];
};

/**
 * Projects Syria geographical coordinates (WGS84 lat/long) into relative
 * canvas percentages (0-100%).
 */
function getMapCoords(attraction: AdminAttraction): { x: number; y: number } {
  const minLat = 32.2;
  const maxLat = 37.3;
  const minLng = 35.4;
  const maxLng = 42.0;

  const x = Math.max(
    8,
    Math.min(92, ((attraction.longitude - minLng) / (maxLng - minLng)) * 80 + 10),
  );
  const y = Math.max(
    8,
    Math.min(92, 100 - (((attraction.latitude - minLat) / (maxLat - minLat)) * 80 + 10)),
  );
  return { x, y };
}

export function AdminHeritageSitesMap({
  attractions,
}: AdminHeritageSitesMapProps): ReactNode {
  const t = useTranslations("admin.attractions");
  const tGov = useTranslations("landing.governorates");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";

  const [selectedSite, setSelectedSite] = useState<AdminAttraction | null>(null);
  const [hoveredSiteId, setHoveredSiteId] = useState<string | null>(null);

  const pinnedSites = useMemo(() => {
    return attractions.map((site) => ({
      site,
      coords: getMapCoords(site),
    }));
  }, [attractions]);

  return (
    <GlassPanel className="relative min-h-135">
      <p className="sr-only">{t("mapDescription")}</p>
      <div className="border-glass-border bg-glass-control/40 flex items-center justify-between border-b px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-2">
          <Compass className="text-accent size-4 shrink-0" aria-hidden />
          <span className="text-prose text-xs font-semibold">
            {t("mapTitle")}
          </span>
          <span className="text-prose-muted text-xs">
            {t("mapSitesCount", { count: attractions.length })}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-prose-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" aria-hidden />
            <span>{t("status.published")}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-accent" aria-hidden />
            <span>{t("status.draft")}</span>
          </span>
        </div>
      </div>

      <div className="relative flex-1 min-h-115 w-full overflow-hidden select-none">
        {/* Subtle Map Grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Abstract Syria Stylized Regional Outlines */}
        <svg
          className="absolute inset-0 size-full pointer-events-none opacity-25"
          viewBox="0 0 800 600"
          preserveAspectRatio="none"
          aria-hidden
        >
          {/* Stylized Syria outer contour */}
          <path
            d="M 160,200 C 180,120 280,100 450,110 C 600,120 720,240 700,320 C 680,400 580,480 480,510 C 350,540 220,530 180,440 C 150,380 140,280 160,200 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="text-primary/40"
          />
          {/* Euphrates river curve */}
          <path
            d="M 320,110 Q 420,220 540,310 T 680,440"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-accent/30"
          />
        </svg>

        {/* Governorate Anchor Dots */}
        {GOVERNORATES.map((gov) => (
          <div
            key={gov.slug}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 opacity-30 transition-opacity"
            style={{
              left: `${gov.positionPercent.x}%`,
              top: `${gov.positionPercent.y}%`,
            }}
          >
            <span className="block size-1.5 rounded-full bg-prose-muted" />
            <span className="text-[10px] tracking-wide text-prose-muted whitespace-nowrap select-none">
              {tGov(gov.slug as GovernorateSlug)}
            </span>
          </div>
        ))}

        {/* Heritage Sites Pins */}
        {pinnedSites.map(({ site, coords }) => {
          const isSelected = selectedSite?.id === site.id;
          const isHovered = hoveredSiteId === site.id;
          const title = localizedName(site.name, loc);

          return (
            <div
              key={site.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform duration-200"
              style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`,
                transform: isSelected ? "translate(-50%, -50%) scale(1.2)" : "translate(-50%, -50%)",
              }}
              onMouseEnter={() => setHoveredSiteId(site.id)}
              onMouseLeave={() => setHoveredSiteId(null)}
              onClick={() => setSelectedSite(site)}
            >
              <div className="relative flex flex-col items-center group">
                {/* Glowing Aura when Selected or Hovered */}
                {(isSelected || isHovered) && (
                  <span
                    className={cn(
                      "absolute -inset-2 rounded-full animate-ping opacity-35",
                      site.published ? "bg-primary" : "bg-accent",
                    )}
                    aria-hidden
                  />
                )}

                {/* Marker Button */}
                <button
                  type="button"
                  aria-label={title}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl border shadow-lg transition-all duration-200",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-primary/30"
                      : site.published
                        ? "border-glass-border bg-glass-surface hover:border-primary/50 text-primary hover:scale-110"
                        : "border-accent/40 bg-accent/15 text-accent hover:scale-110",
                  )}
                >
                  <Landmark className="size-4.5" aria-hidden />
                </button>

                {/* Pin Tooltip Label */}
                <span
                  className={cn(
                    "pointer-events-none mt-1 whitespace-nowrap rounded-md border border-glass-border bg-glass-panel/90 px-2 py-0.5 text-[11px] font-medium text-prose shadow-sm backdrop-blur-md transition-opacity duration-150",
                    isSelected || isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                  )}
                >
                  {title}
                </span>
              </div>
            </div>
          );
        })}

        <AnimatePresence>
          {selectedSite ? (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-4 inset-s-4 inset-e-4 z-20 sm:inset-e-auto sm:w-96"
            >
              <GlassPanel className="p-4 shadow-2xl border-primary/30 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedSite.published ? "solid" : "outline"}>
                      {t(`status.${selectedSite.published ? "published" : "draft"}`)}
                    </Badge>
                    <Badge variant="glass">
                      {tGov(selectedSite.governorate as GovernorateSlug)}
                    </Badge>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSite(null)}
                    aria-label={t("closePreview")}
                    className="border-glass-border bg-glass-control text-prose-muted hover:text-prose flex size-7 items-center justify-center rounded-lg border transition-colors"
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-glass-border bg-glass-control">
                    <Image
                      src={selectedSite.imageSrc}
                      alt={localizedName(selectedSite.name, loc)}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-prose text-sm font-semibold truncate">
                      {localizedName(selectedSite.name, loc)}
                    </h4>
                    <p className="text-prose-muted text-xs line-clamp-2 mt-0.5 leading-relaxed">
                      {localizedName(selectedSite.narrative, loc)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-prose-muted border-t border-glass-border pt-2.5">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" aria-hidden />
                    <span>
                      {formatPickerTime(selectedSite.opensAt, loc, "24")}–
                      {formatPickerTime(selectedSite.closesAt, loc, "24")}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-prose">
                    <Coins className="size-3.5 text-accent" aria-hidden />
                    <span>
                      {selectedSite.entryFeeSyp === 0
                        ? t("free")
                        : formatSyp(selectedSite.entryFeeSyp, loc)}
                    </span>
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="solid"
                  href={ADMIN_PATHS.heritageSite(selectedSite.id)}
                  className="w-full justify-center gap-1.5"
                >
                  <span>{t("openSite")}</span>
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </Button>
              </GlassPanel>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </GlassPanel>
  );
}
