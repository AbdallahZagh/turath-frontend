import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminAuditLogsPage } from "@/components/admin/AdminAuditLogsPage";
import { getTranslations } from "@/i18n/serverTranslations";

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
