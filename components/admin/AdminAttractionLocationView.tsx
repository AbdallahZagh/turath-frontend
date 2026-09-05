"use client";

import { Check, Compass, Copy, ExternalLink, MapPin } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { AdminAttraction } from "@/lib/mock/adminAttractions";
import { toast } from "@/store/toastStore";

type AdminAttractionLocationViewProps = {
  attraction: AdminAttraction;
};

export function AdminAttractionLocationView({
  attraction,
}: AdminAttractionLocationViewProps): ReactNode {
  const t = useTranslations("admin.attractions");
  const [copied, setCopied] = useState(false);

  const coordsString = `${attraction.latitude}, ${attraction.longitude}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${attraction.latitude},${attraction.longitude}`;

  async function onCopyCoordinates(): Promise<void> {
    try {
      await navigator.clipboard.writeText(coordsString);
      setCopied(true);
      toast.success(t("detail.copiedCoordinates"), coordsString);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("detail.copyFailed"));
    }
  }

  return (
    <GlassPanel className="flex flex-col gap-5 p-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <MapPin className="text-primary size-5" aria-hidden />
          <h2 className="font-heading text-prose text-lg font-semibold">
            {t("detail.coordinates")}
          </h2>
        </div>
        <p className="text-prose-muted text-xs">{t("detail.coordinatesHint")}</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="border-glass-border/80 bg-glass-control flex items-center gap-2 rounded-xl border px-3 py-2 text-sm">
            <span className="text-prose-muted text-xs font-semibold uppercase">
              {t("form.latitude")}
            </span>
            <span className="text-prose font-mono font-semibold tabular-nums">
              {attraction.latitude.toFixed(6)}°
            </span>
          </div>

          <div className="border-glass-border/80 bg-glass-control flex items-center gap-2 rounded-xl border px-3 py-2 text-sm">
            <span className="text-prose-muted text-xs font-semibold uppercase">
              {t("form.longitude")}
            </span>
            <span className="text-prose font-mono font-semibold tabular-nums">
              {attraction.longitude.toFixed(6)}°
            </span>
          </div>

          <Button
            type="button"
            variant="glass"
            size="sm"
            onClick={() => void onCopyCoordinates()}
            className="flex items-center gap-1.5"
          >
            {copied ? (
              <Check className="text-success size-3.5" aria-hidden />
            ) : (
              <Copy className="size-3.5" aria-hidden />
            )}
            <span>{t("detail.copyCoordinates")}</span>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/explore">
            <Button variant="glass" size="sm" className="flex items-center gap-1.5">
              <Compass className="text-primary size-3.5" aria-hidden />
              <span>{t("detail.viewExplore")}</span>
            </Button>
          </Link>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            <Button variant="glass" size="sm" className="flex items-center gap-1.5">
              <ExternalLink className="size-3.5" aria-hidden />
              <span>{t("detail.googleMaps")}</span>
            </Button>
          </a>
        </div>
      </div>
    </GlassPanel>
  );
}
