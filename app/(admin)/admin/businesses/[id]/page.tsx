import type { ReactNode } from "react";

import { AdminProviderDetail } from "@/components/admin/AdminProviderDetail";

type AdminProviderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProviderDetailPage({
  params,
}: AdminProviderDetailPageProps): Promise<ReactNode> {
  const { id } = await params;
  return <AdminProviderDetail providerId={id} />;
}
