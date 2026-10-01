import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminReviewsPage } from "@/components/admin/AdminReviewsPage";
import { getTranslations } from "@/i18n/serverTranslations";

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
