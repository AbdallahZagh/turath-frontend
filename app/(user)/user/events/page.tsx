import type { Metadata } from "next";
import type { ReactNode } from "react";

import { EventCatalogScreen } from "@/components/events/EventCatalogScreen";
import { getTranslations } from "@/i18n/serverTranslations";

export async function generateMetadata(): Promise<Metadata> { const t = await getTranslations("events.headers.index"); return { title: t("title"), description: t("description") }; }
export default function UserEventsPage(): ReactNode { return <EventCatalogScreen detailBasePath="/user/events" />; }
