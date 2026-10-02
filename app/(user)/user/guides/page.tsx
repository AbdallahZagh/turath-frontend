import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GuideCatalogScreen } from "@/components/guides/GuideCatalogScreen";
import { getTranslations } from "@/i18n/serverTranslations";
export async function generateMetadata(): Promise<Metadata> { const t = await getTranslations("guides.headers.index"); return { title: t("title"), description: t("description") }; }
export default function UserGuidesPage(): ReactNode { return <GuideCatalogScreen detailBasePath="/user/guides" />; }
