import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ReliabilityOverview } from "@/components/account/ReliabilityOverview";
import { getTranslations } from "@/i18n/serverTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account.headers.reliability");
  return { title: t("title"), description: t("description") };
}

export default function UserReliabilityPage(): ReactNode {
  return <ReliabilityOverview />;
}
