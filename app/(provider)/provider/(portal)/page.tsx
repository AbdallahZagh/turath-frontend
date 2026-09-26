import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { ProviderDashboard } from "@/components/provider/ProviderDashboard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("provider.headers.dashboard");
  return { title: t("title"), description: t("description") };
}

export default function ProviderDashboardPage(): ReactNode {
  return <ProviderDashboard />;
}
