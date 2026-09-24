import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AttractionCatalogScreen } from "@/components/attractions/AttractionCatalogScreen";
import type { ListingSearchParams } from "@/lib/search/listingParams";

export async function generateMetadata(): Promise<Metadata> { const t = await getTranslations("attractions.headers.index"); return { title: `${t("title")} | Turath`, description: t("description") }; }
export default function UserAttractionsPage({ searchParams }: { searchParams: ListingSearchParams }): ReactNode { return <AttractionCatalogScreen searchParams={searchParams} detailBasePath="/user/attractions" />; }
