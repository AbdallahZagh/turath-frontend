import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { ProviderPersonalProfileScreen } from "@/components/provider/ProviderPersonalProfileScreen";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("provider.headers.myProfile");
  return { title: `${t("title")} | Turath`, description: t("description") };
}

export default function ProviderMyProfilePage(): ReactNode {
  return <ProviderPersonalProfileScreen />;
}
