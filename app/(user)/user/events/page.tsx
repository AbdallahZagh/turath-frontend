import type { Metadata } from "next";
import type { ReactNode } from "react";

import { EventCatalogScreen } from "@/components/events/EventCatalogScreen";
import { getTranslations } from "@/i18n/serverTranslations";
import type { ListingSearchParams } from "@/lib/search/listingParams";

export async function generateMetadata(): Promise<Metadata> { const t = await getTranslations("events.headers.index"); return { title: t("title"), description: t("description") }; }
export default function UserEventsPage({ searchParams }: { searchParams: ListingSearchParams }): ReactNode { return <EventCatalogScreen searchParams={searchParams} detailBasePath="/user/events" />; }
