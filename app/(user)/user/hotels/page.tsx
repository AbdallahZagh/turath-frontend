import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { HotelCatalogScreen } from "@/components/hotels/HotelCatalogScreen";
import type { ListingSearchParams } from "@/lib/search/listingParams";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("hotels.headers.index");
  return { title: t("title"), description: t("description") };
}

export default function UserHotelsPage({ searchParams }: { searchParams: ListingSearchParams }): ReactNode {
  return <HotelCatalogScreen searchParams={searchParams} detailBasePath="/user/hotels" />;
}
