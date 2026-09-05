import { toIsoDate } from "@/lib/format/datetime";
import { listAdminBookingsByProviderName } from "@/lib/mock/adminBookings";
import {
  getAdminLedgerByProviderName,
  type AdminLedgerRow,
} from "@/lib/mock/adminLedger";
import {
  buildProviderActivity,
  type AdminProviderActivityEvent,
} from "@/lib/mock/adminProviderActivity";
import {
  getAdminProvider as readAdminProvider,
  listAdminProviders as readAdminProviders,
  setAdminProviderFinance as writeAdminProviderFinance,
  setAdminProviderStatus as writeAdminProviderStatus,
  type AdminProvider,
  type AdminProviderFinanceInput,
  type ProviderStatus,
} from "@/lib/mock/adminProviders";
import {
  listReviewsAboutProvider,
  type AdminReview,
} from "@/lib/mock/adminReviews";

export type AdminProviderDetailData = {
  provider: AdminProvider;
  ledger: AdminLedgerRow | null;
  activity: AdminProviderActivityEvent[];
  reviews: AdminReview[];
};

export async function listAdminProviders(): Promise<AdminProvider[]> {
  return readAdminProviders();
}

export async function getAdminProviderDetail(
  id: string,
): Promise<AdminProviderDetailData | null> {
  const provider = readAdminProvider(id);
  if (!provider) {
    return null;
  }

  const ledger = getAdminLedgerByProviderName(provider.name.en) ?? null;
  const bookings = listAdminBookingsByProviderName(provider.name.en);

  return {
    provider,
    ledger,
    activity: buildProviderActivity(provider, bookings, ledger),
    reviews: listReviewsAboutProvider(provider.name.en),
  };
}

export async function setAdminProviderStatus(
  id: string,
  status: ProviderStatus,
): Promise<AdminProvider> {
  return writeAdminProviderStatus(id, status, toIsoDate(new Date()));
}

export async function setAdminProviderFinance(
  id: string,
  input: AdminProviderFinanceInput,
): Promise<AdminProvider> {
  return writeAdminProviderFinance(id, input, toIsoDate(new Date()));
}
