import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ProviderDashboard } from "@/components/provider/ProviderDashboard";
import { getTranslations } from "@/i18n/serverTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("provider.headers.dashboard");
  return { title: t("title"), description: t("description") };
}

export default function ProviderDashboardPage(): ReactNode {
  return <ProviderDashboard />;
}
