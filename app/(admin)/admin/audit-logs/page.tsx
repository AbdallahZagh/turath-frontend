import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AdminAuditLogsPage } from "@/components/admin/AdminAuditLogsPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("admin.headers.auditLogs");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function AuditLogsRoute(): ReactNode {
  return <AdminAuditLogsPage />;
}
