import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AttractionCatalogScreen } from "@/components/attractions/AttractionCatalogScreen";
import { PageHeader } from "@/components/ui/PageHeader";
import type { ListingSearchParams } from "@/lib/search/listingParams";

export async function generateMetadata(): Promise<Metadata> { const t = await getTranslations("attractions.headers.index"); return { title: t("title"), description: t("description") }; }
export default function AttractionsPage({ searchParams }: { searchParams: ListingSearchParams }): ReactNode { return <div className="mx-auto max-w-[98rem] px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8"><PageHeader /><AttractionCatalogScreen searchParams={searchParams} /></div>; }
