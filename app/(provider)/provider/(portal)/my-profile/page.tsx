import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ProviderPersonalProfileScreen } from "@/components/provider/ProviderPersonalProfileScreen";
import { getTranslations } from "@/i18n/serverTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("provider.headers.myProfile");
  return { title: t("title"), description: t("description") };
}

export default function ProviderMyProfilePage(): ReactNode {
  return <ProviderPersonalProfileScreen />;
}
