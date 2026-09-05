import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AdminReviewsPage } from "@/components/admin/AdminReviewsPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("admin.headers.reviews");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ReviewsRoute(): ReactNode {
  return <AdminReviewsPage />;
}
