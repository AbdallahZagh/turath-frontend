import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AccountProfile } from "@/components/account/AccountProfile";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account.headers.profile");
  return { title: t("title"), description: t("description") };
}

export default function UserProfilePage(): ReactNode {
  return <AccountProfile />;
}
