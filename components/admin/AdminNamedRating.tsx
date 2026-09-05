"use client";

import type { ReactNode } from "react";

import { AdminStarRating } from "@/components/admin/AdminStarRating";
import {
  guestRatingSummary,
  providerRatingSummary,
  type ReviewAbout,
} from "@/lib/mock/adminReviews";

type AdminNamedRatingProps = {
  about: ReviewAbout;
  nameEn: string;
  size?: "sm" | "md";
  layout?: "stack" | "inline";
};

export function AdminNamedRating({
  about,
  nameEn,
  size = "sm",
  layout = "inline",
}: AdminNamedRatingProps): ReactNode {
  const rating =
    about === "guest" ? guestRatingSummary(nameEn) : providerRatingSummary(nameEn);

  return (
    <AdminStarRating
      average={rating.average}
      count={rating.count}
      size={size}
      layout={layout}
    />
  );
}
