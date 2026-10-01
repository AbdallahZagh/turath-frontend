import type { Metadata } from "next";
import type { ReactNode } from "react";

import { TripCatalogScreen } from "@/components/trips/TripCatalogScreen";
import { getTranslations } from "@/i18n/serverTranslations";
import type { ListingSearchParams } from "@/lib/search/listingParams";

export async function generateMetadata(): Promise<Metadata> { const t = await getTranslations("trips.headers.index"); return { title: t("title"), description: t("description") }; }
export default function UserTripsPage({ searchParams }: { searchParams: ListingSearchParams }): ReactNode { return <TripCatalogScreen searchParams={searchParams} detailBasePath="/user/trips" />; }
