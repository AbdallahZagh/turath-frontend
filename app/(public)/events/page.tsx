import type { Metadata } from "next";
import type { ReactNode } from "react";

import { EventCatalogScreen } from "@/components/events/EventCatalogScreen";
import { PageHeader } from "@/components/ui/PageHeader";
import { getTranslations } from "@/i18n/serverTranslations";
import type { ListingSearchParams } from "@/lib/search/listingParams";

export async function generateMetadata(): Promise<Metadata> { const t = await getTranslations("events.headers.index"); return { title: t("title"), description: t("description") }; }
export default function EventsPage({ searchParams }: { searchParams: ListingSearchParams }): ReactNode { return <div className="mx-auto max-w-[98rem] px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8"><PageHeader /><EventCatalogScreen searchParams={searchParams} /></div>; }
