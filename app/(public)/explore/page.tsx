import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense, type ReactNode } from "react";

import { ExploreScreen } from "@/components/discovery/ExploreScreen";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export async function generateMetadata(): Promise<Metadata> { const t = await getTranslations("discovery.headers.explore"); return { title: `${t("title")} | Turath`, description: t("description") }; }
export default function ExplorePage(): ReactNode { return <div className="px-2 pb-8 pt-28 sm:px-4 sm:pt-32"><div className="mx-auto max-w-[98rem]"><PageHeader /></div><Suspense fallback={<Skeleton className="min-h-[36rem]" />}><ExploreScreen /></Suspense></div>; }
