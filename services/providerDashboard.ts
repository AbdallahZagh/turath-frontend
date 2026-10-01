import {
  getProviderDashboardByDays,
  type ProviderDashboardData,
} from "@/lib/mock/providerDashboard";
import type { ProviderCategory } from "@/lib/validation/auth";

export async function getProviderDashboard(
  days = 30,
  category: ProviderCategory = "hotels",
): Promise<ProviderDashboardData> {
  return getProviderDashboardByDays(days, category);
}
