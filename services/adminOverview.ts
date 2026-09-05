import {
  getAdminOverviewByDays,
  type AdminOverview,
} from "@/lib/mock/adminOverview";

export async function getAdminOverview(days = 30): Promise<AdminOverview> {
  return getAdminOverviewByDays(days);
}
