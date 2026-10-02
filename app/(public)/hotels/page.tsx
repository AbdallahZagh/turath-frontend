import type { Metadata } from "next";
import type { ReactNode } from "react";

import { HotelCatalogScreen } from "@/components/hotels/HotelCatalogScreen";
import { PageHeader } from "@/components/ui/PageHeader";
import { getTranslations } from "@/i18n/serverTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("hotels.headers.index");
  return { title: t("title"), description: t("description") };
}

export default function HotelsPage(): ReactNode {
  return (
    <div className="mx-auto max-w-[98rem] px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8">
      <PageHeader />
      <HotelCatalogScreen />
    </div>
  );
}
