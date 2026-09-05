"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";

import { StarRating } from "@/components/ui/StarRating";
import type { Locale } from "@/i18n/config";
import { formatCount, formatRating } from "@/lib/format/number";

type AdminStarRatingProps = {
  average: number;
  count: number;
  size?: "sm" | "md";
  /** One line for tables; stacked stars + count for profiles. */
  layout?: "stack" | "inline";
};

export function AdminStarRating({
  average,
  count,
  size = "sm",
  layout = "stack",
}: AdminStarRatingProps): ReactNode {
  const t = useTranslations("ui");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";

  if (count === 0) {
    if (layout === "inline") {
      return <span className="text-prose-muted text-xs">{t("ratingEmpty")}</span>;
    }
    return (
      <div className="flex flex-col gap-0.5">
        <StarRating value={0} size={size} label={t("ratingEmpty")} />
        <span className="text-prose-muted text-xs">{t("ratingEmpty")}</span>
      </div>
    );
  }

  const valueLabel = formatRating(average, loc);
  const countLabel = formatCount(count, loc);
  const stars = (
    <StarRating
      value={average}
      size={size}
      label={t("ratingLabel", { value: valueLabel, count: countLabel })}
    />
  );

  if (layout === "inline") {
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        {stars}
        <span className="text-prose text-sm font-semibold tabular-nums">{valueLabel}</span>
        <span className="text-prose-muted text-xs tabular-nums">
          {t("ratingCount", { count: countLabel })}
        </span>
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5">
        {stars}
        <span className="text-prose text-sm font-semibold tabular-nums">{valueLabel}</span>
      </div>
      <span className="text-prose-muted text-xs tabular-nums">
        {t("ratingCount", { count: countLabel })}
      </span>
    </div>
  );
}
