"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/Badge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { formatCount, formatReliabilityScore } from "@/lib/format/number";
import {
  reliabilityNoShowCount,
  reliabilityTier,
  reliabilityTierClass,
  type AdminUser,
  type ReliabilityCutoffs,
} from "@/lib/mock/adminUsers";

type AdminUserReliabilityProps = {
  user: AdminUser;
  cutoffs: ReliabilityCutoffs;
};

export function AdminUserReliability({
  user,
  cutoffs,
}: AdminUserReliabilityProps): ReactNode {
  const t = useTranslations("admin.users");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const tier = reliabilityTier(user.reliability, cutoffs);

  return (
    <GlassPanel className="flex-none justify-between gap-5 p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-prose text-lg font-semibold">{t("detail.reliabilityTitle")}</h2>
        <p className="text-prose-muted text-sm leading-relaxed">
          {t(`detail.reliabilityHint.${tier}`)}
        </p>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span
            className={cn(
              "font-heading text-5xl font-semibold tabular-nums tracking-tight",
              reliabilityTierClass(tier),
            )}
          >
            {formatReliabilityScore(user.reliability, loc)}
          </span>
          <Badge
            variant={tier === "suspended" || tier === "restricted" ? "outline" : "glass"}
            className={reliabilityTierClass(tier)}
          >
            {t(`reliabilityTier.${tier}`)}
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
