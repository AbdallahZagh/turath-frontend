import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense, type ReactNode } from "react";

import { SearchScreen } from "@/components/discovery/SearchScreen";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export async function generateMetadata(): Promise<Metadata> { const t = await getTranslations("discovery.headers.search"); return { title: t("title"), description: t("description") }; }
export default function SearchPage(): ReactNode { return <div className="mx-auto max-w-[98rem] px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8"><PageHeader /><Suspense fallback={<Skeleton className="min-h-[36rem]" />}><SearchScreen /></Suspense></div>; }
