"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/Badge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { formatCount, formatPercent } from "@/lib/format/number";
import {
  reliabilityBand,
  reliabilityBandClass,
  reliabilityNoShowCount,
  type AdminUser,
} from "@/lib/mock/adminUsers";

type AdminUserReliabilityProps = {
  user: AdminUser;
  atRiskBelow: number;
  watchBelow: number;
};

export function AdminUserReliability({
  user,
  atRiskBelow,
  watchBelow,
}: AdminUserReliabilityProps): ReactNode {
  const t = useTranslations("admin.users");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const band = reliabilityBand(user.reliability, atRiskBelow, watchBelow);

  return (
    <GlassPanel className="flex-none justify-between gap-5 p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-prose text-lg font-semibold">{t("detail.reliabilityTitle")}</h2>
        <p className="text-prose-muted text-sm leading-relaxed">
          {t(`detail.reliabilityHint.${band}`)}
        </p>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span
            className={cn(
              "font-heading text-5xl font-semibold tabular-nums tracking-tight",
              reliabilityBandClass(band),
            )}
          >
            {formatPercent(user.reliability, loc, 0)}
          </span>
          <Badge variant={band === "atRisk" ? "outline" : "glass"} className={reliabilityBandClass(band)}>
            {t(`reliabilityBand.${band}`)}
          </Badge>
        </div>
        <dl className="grid gap-3 text-sm">
          <div className="flex items-baseline justify-between gap-6">
            <dt className="text-prose-muted">{t("detail.completedCheckIns")}</dt>
            <dd className="font-medium tabular-nums">
              {formatCount(user.completedBookings, loc)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-6">
            <dt className="text-prose-muted">{t("detail.noShows")}</dt>
            <dd className="font-medium tabular-nums">
              {formatCount(reliabilityNoShowCount(user), loc)}
            </dd>
          </div>
        </dl>
      </div>
    </GlassPanel>
  );
}
