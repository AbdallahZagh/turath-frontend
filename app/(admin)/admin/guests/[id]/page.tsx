import type { ReactNode } from "react";

import { AdminUserDetail } from "@/components/admin/AdminUserDetail";

type AdminUserDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserDetailPage({
  params,
}: AdminUserDetailPageProps): Promise<ReactNode> {
  const { id } = await params;
  return <AdminUserDetail userId={id} />;
}
