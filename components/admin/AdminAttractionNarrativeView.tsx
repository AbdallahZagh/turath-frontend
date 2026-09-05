"use client";

import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { GlassPanel } from "@/components/ui/GlassPanel";
import type { AdminAttraction } from "@/lib/mock/adminAttractions";

type AdminAttractionNarrativeViewProps = {
  attraction: AdminAttraction;
};

export function AdminAttractionNarrativeView({
  attraction,
}: AdminAttractionNarrativeViewProps): ReactNode {
  const t = useTranslations("admin.attractions");

  return (
    <GlassPanel className="flex flex-col gap-5 p-6">
      <div className="flex items-center gap-2">
        <BookOpen className="text-primary size-5" aria-hidden />
        <h2 className="font-heading text-prose text-lg font-semibold">
          {t("detail.narrativeTitle")}
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border-glass-border/70 bg-glass-control flex flex-col gap-2 rounded-2xl border p-4 sm:p-5">
          <span className="text-prose-muted text-xs font-semibold tracking-wide uppercase">
            {t("detail.narrativeEn")}
          </span>
          <p className="text-prose text-sm leading-relaxed sm:text-base">
            {attraction.narrative.en}
          </p>
        </div>

        <div
          dir="rtl"
          className="border-glass-border/70 bg-glass-control flex flex-col gap-2 rounded-2xl border p-4 sm:p-5"
        >
          <span className="text-prose-muted text-xs font-semibold tracking-wide">
            {t("detail.narrativeAr")}
          </span>
          <p className="text-prose text-sm leading-loose sm:text-base">
            {attraction.narrative.ar}
          </p>
        </div>
      </div>
    </GlassPanel>
  );
}
