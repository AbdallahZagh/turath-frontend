import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { AdminAuditLog } from "@/lib/mock/adminAuditLogs";
import { fetchAdminAuditLogs } from "@/services/adminAuditLogs";

const adminAuditLogsQueryKey = ["admin", "audit-logs"] as const;

export function useAdminAuditLogs(): UseQueryResult<AdminAuditLog[]> {
  return useQuery({
    queryKey: adminAuditLogsQueryKey,
    queryFn: fetchAdminAuditLogs,
  });
}
