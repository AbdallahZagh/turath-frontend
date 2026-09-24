import {
  getProviderDashboardByDays,
  type ProviderDashboardData,
} from "@/lib/mock/providerDashboard";

export async function getProviderDashboard(
  days = 30,
): Promise<ProviderDashboardData> {
  return getProviderDashboardByDays(days);
}

