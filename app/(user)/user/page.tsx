import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AccountOverview } from "@/components/account/AccountOverview";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account.headers.profile");
  return { title: `${t("title")} | Turath`, description: t("description") };
}

export default function UserPage(): ReactNode {
  return <AccountOverview />;
}
