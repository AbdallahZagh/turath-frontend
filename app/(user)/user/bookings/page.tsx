import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AccountBookings } from "@/components/account/AccountBookings";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account.headers.bookings");
  return { title: `${t("title")} | Turath`, description: t("description") };
}

export default function UserBookingsPage(): ReactNode {
  return <AccountBookings />;
}
