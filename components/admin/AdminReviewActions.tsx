"use client";

import { CheckCircle2, EyeOff, Flag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Menu, type MenuItem } from "@/components/ui/Menu";
import type { Locale } from "@/i18n/config";
import { localizedName } from "@/lib/i18n/localized";
import type { AdminReview, ReviewModerationStatus } from "@/lib/mock/adminReviews";

type AdminReviewActionsProps = {
  review: AdminReview;
  disabled?: boolean;
  onModerate: (review: AdminReview, status: ReviewModerationStatus) => void;
};

export function AdminReviewActions({
  review,
  disabled = false,
  onModerate,
}: AdminReviewActionsProps): ReactNode {
  const t = useTranslations("admin.reviewsPage");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const name = localizedName(review.author, loc);
  const status = review.status ?? "published";

  const items: MenuItem[] = [];
  if (status !== "published") {
    items.push({
      id: "publish",
      label: t("actions.publish"),
      icon: <CheckCircle2 className="size-3.5" />,
      onSelect: () => onModerate(review, "published"),
    });
  }
  if (status !== "flagged") {
    items.push({
      id: "flag",
      label: t("actions.flag"),
      icon: <Flag className="size-3.5" />,
      onSelect: () => onModerate(review, "flagged"),
    });
  }
  if (status !== "hidden") {
    items.push({
      id: "hide",
      label: t("actions.hide"),
      icon: <EyeOff className="size-3.5" />,
      tone: "destructive",
      onSelect: () => onModerate(review, "hidden"),
    });
  }

  return (
    <Menu
      label={t("actionMenu", { name })}
      items={items}
      disabled={disabled}
    />
  );
}
