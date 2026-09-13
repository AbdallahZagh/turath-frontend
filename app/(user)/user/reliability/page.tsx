import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { ReliabilityOverview } from "@/components/account/ReliabilityOverview";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account.headers.reliability");
  return { title: `${t("title")} | Turath`, description: t("description") };
}

export default function UserReliabilityPage(): ReactNode {
  return <ReliabilityOverview />;
}
