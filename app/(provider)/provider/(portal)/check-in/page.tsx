import type { ReactNode } from "react";

import { ProviderCheckInScreen } from "@/components/provider/ProviderCheckInScreen";

export default async function ProviderCheckInPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string | string[] }>;
}): Promise<ReactNode> {
  const { code } = await searchParams;
  return <ProviderCheckInScreen initialCode={typeof code === "string" ? code : ""} />;
}
