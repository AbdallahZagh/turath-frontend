import { listAdminAuditLogs, type AdminAuditLog } from "@/lib/mock/adminAuditLogs";

export async function fetchAdminAuditLogs(): Promise<AdminAuditLog[]> {
  return listAdminAuditLogs();
}
