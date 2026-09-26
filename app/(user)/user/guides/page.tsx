import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { GuideCatalogScreen } from "@/components/guides/GuideCatalogScreen";
import type { ListingSearchParams } from "@/lib/search/listingParams";
export async function generateMetadata(): Promise<Metadata> { const t = await getTranslations("guides.headers.index"); return { title: t("title"), description: t("description") }; }
export default function UserGuidesPage({ searchParams }: { searchParams: ListingSearchParams }): ReactNode { return <GuideCatalogScreen searchParams={searchParams} detailBasePath="/user/guides" />; }
