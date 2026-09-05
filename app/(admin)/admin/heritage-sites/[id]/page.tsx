import type { ReactNode } from "react";

import { AdminAttractionDetail } from "@/components/admin/AdminAttractionDetail";

type AdminAttractionDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminAttractionDetailPage({
  params,
}: AdminAttractionDetailPageProps): Promise<ReactNode> {
  const { id } = await params;
  return <AdminAttractionDetail attractionId={id} />;
}
