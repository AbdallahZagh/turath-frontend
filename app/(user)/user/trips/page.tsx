import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { TripCatalogScreen } from "@/components/trips/TripCatalogScreen";
import type { ListingSearchParams } from "@/lib/search/listingParams";

export async function generateMetadata(): Promise<Metadata> { const t = await getTranslations("trips.headers.index"); return { title: `${t("title")} | Turath`, description: t("description") }; }
export default function UserTripsPage({ searchParams }: { searchParams: ListingSearchParams }): ReactNode { return <TripCatalogScreen searchParams={searchParams} detailBasePath="/user/trips" />; }
