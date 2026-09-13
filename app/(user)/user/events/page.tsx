import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { EventCatalogScreen } from "@/components/events/EventCatalogScreen";
import type { ListingSearchParams } from "@/lib/search/listingParams";

export async function generateMetadata(): Promise<Metadata> { const t = await getTranslations("events.headers.index"); return { title: `${t("title")} | Turath`, description: t("description") }; }
export default function UserEventsPage({ searchParams }: { searchParams: ListingSearchParams }): ReactNode { return <EventCatalogScreen searchParams={searchParams} detailBasePath="/user/events" />; }
