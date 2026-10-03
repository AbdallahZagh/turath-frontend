import type { Metadata } from "next";
import type { ReactNode } from "react";

import { RestaurantCatalogScreen } from "@/components/restaurants/RestaurantCatalogScreen";
import { getTranslations } from "@/i18n/serverTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("restaurants.headers.index");
  return { title: t("title"), description: t("description") };
}

export default function UserRestaurantsPage(): ReactNode {
  return <RestaurantCatalogScreen detailBasePath="/user/restaurants" />;
}
