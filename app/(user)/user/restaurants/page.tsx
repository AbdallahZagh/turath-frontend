import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { RestaurantCatalogScreen } from "@/components/restaurants/RestaurantCatalogScreen";
import type { ListingSearchParams } from "@/lib/search/listingParams";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("restaurants.headers.index");
  return { title: `${t("title")} | Turath`, description: t("description") };
}

export default function UserRestaurantsPage({ searchParams }: { searchParams: ListingSearchParams }): ReactNode {
  return <RestaurantCatalogScreen searchParams={searchParams} detailBasePath="/user/restaurants" />;
}
