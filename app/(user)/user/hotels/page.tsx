import type { Metadata } from "next";
import type { ReactNode } from "react";

import { HotelCatalogScreen } from "@/components/hotels/HotelCatalogScreen";
import { getTranslations } from "@/i18n/serverTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("hotels.headers.index");
  return { title: t("title"), description: t("description") };
}

export default function UserHotelsPage(): ReactNode {
  return <HotelCatalogScreen detailBasePath="/user/hotels" />;
}
