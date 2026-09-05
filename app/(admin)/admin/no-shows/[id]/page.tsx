import type { ReactNode } from "react";

import { AdminDisputeDetail } from "@/components/admin/AdminDisputeDetail";

type AdminDisputeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminDisputeDetailPage({
  params,
}: AdminDisputeDetailPageProps): Promise<ReactNode> {
  const { id } = await params;
  return <AdminDisputeDetail disputeId={id} />;
}
