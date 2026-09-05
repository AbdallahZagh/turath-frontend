import type { LocalizedName } from "@/lib/i18n/localized";
import { getAdminBookingByCode, type AdminBooking } from "@/lib/mock/adminBookings";
import {
  getAdminDispute as readAdminDispute,
  listAdminDisputes as readAdminDisputes,
  resolveAdminDispute as writeAdminDispute,
  type AdminDispute,
  type DisputeResolution,
} from "@/lib/mock/adminDisputes";
import { findAdminProviderIdByName } from "@/lib/mock/adminProviders";
import { findAdminUserIdByName } from "@/lib/mock/adminUsers";

export type AdminDisputeDetailData = {
  dispute: AdminDispute;
  booking: AdminBooking | null;
  guestId: string | null;
  providerId: string | null;
};

export async function listAdminDisputes(): Promise<AdminDispute[]> {
  return readAdminDisputes();
}

export async function getAdminDisputeDetail(
  id: string,
): Promise<AdminDisputeDetailData | null> {
  const dispute = readAdminDispute(id);
  if (!dispute) {
    return null;
  }

  return {
    dispute,
    booking: getAdminBookingByCode(dispute.bookingCode) ?? null,
    guestId: findAdminUserIdByName(dispute.guest.en) ?? null,
    providerId: findAdminProviderIdByName(dispute.provider.en) ?? null,
  };
}

export async function resolveAdminDispute(
  id: string,
  status: DisputeResolution,
  notes: LocalizedName,
): Promise<AdminDispute> {
  return writeAdminDispute(id, status, notes);
}
