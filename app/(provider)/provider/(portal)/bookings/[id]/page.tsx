import type { ReactNode } from "react";

import { ProviderBookingDetailScreen } from "@/components/provider/ProviderBookingDetailScreen";

export default async function ProviderBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<ReactNode> {
  const { id } = await params;
  return <ProviderBookingDetailScreen id={id} />;
}
