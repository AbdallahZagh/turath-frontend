import type { ReactNode } from "react";

import { AdminLedgerDetail } from "@/components/admin/AdminLedgerDetail";

type AdminLedgerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminLedgerDetailPage({
  params,
}: AdminLedgerDetailPageProps): Promise<ReactNode> {
  const { id } = await params;
  return <AdminLedgerDetail ledgerId={id} />;
}
