"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";

import { StarRating } from "@/components/ui/StarRating";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import { formatCount } from "@/lib/format/number";
import { localizedName } from "@/lib/i18n/localized";
import type { AdminReview } from "@/lib/mock/adminReviews";

type AdminReviewsProps = {
  title: string;
  hint: string;
  empty: string;
  reviews: AdminReview[];
};

export function AdminReviews({
  title,
  hint,
  empty,
  reviews,
}: AdminReviewsProps): ReactNode {
  const tUi = useTranslations("ui");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const other: Locale = loc === "ar" ? "en" : "ar";

  return (
    <GlassPanel className="flex-none gap-4 p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-prose text-lg font-semibold">{title}</h2>
        <p className="text-prose-muted text-sm leading-relaxed">{hint}</p>
      </div>
      {reviews.length === 0 ? (
        <p className="text-prose-muted text-sm">{empty}</p>
      ) : (
        <ul className="divide-glass-border flex flex-col divide-y">
          {reviews.map((review) => {
            const body = localizedName(review.body, loc);
            const bodyOther = localizedName(review.body, other);
            const starsLabel = formatCount(review.stars, loc);
            return (
              <li key={review.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-prose text-sm font-medium">
                      {localizedName(review.author, loc)}
                    </p>
                    <p className="text-prose-muted text-xs">
                      {formatMediumDate(review.at, loc)}
                      <span> · </span>
                      <span className="tracking-wider tabular-nums">{review.bookingCode}</span>
                    </p>
                  </div>
                  <StarRating
                    value={review.stars}
                    size="sm"
                    label={tUi("ratingOutOf", { value: starsLabel })}
                  />
                </div>
                <p className="text-prose text-sm leading-relaxed">{body}</p>
                {bodyOther !== body ? (
                  <p className="text-prose-muted text-sm leading-relaxed">{bodyOther}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </GlassPanel>
  );
}
