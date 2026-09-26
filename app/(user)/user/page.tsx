import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { UserDashboard } from "@/components/account/UserDashboard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account.headers.dashboard");
  return { title: t("title"), description: t("description") };
}

export default function UserPage(): ReactNode {
  return <UserDashboard />;
}
