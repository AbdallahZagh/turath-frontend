import type { TouristBookingStatus } from "@/lib/mock/bookings";
import type { ProviderCategory } from "@/lib/validation/auth";
import {
  getProviderBooking as getProviderBookingMock,
  listProviderBookings as listProviderBookingsMock,
  updateProviderBookingStatus as updateProviderBookingStatusMock,
  type ProviderBooking,
} from "@/lib/mock/providerBookings";

export async function listProviderBookings(category: ProviderCategory): Promise<ProviderBooking[]> {
  return listProviderBookingsMock(category);
}

export async function getProviderBooking(
  id: string,
  category: ProviderCategory,
): Promise<ProviderBooking | null> {
  return getProviderBookingMock(id, category) ?? null;
}

export async function updateProviderBookingStatus(input: {
  id: string;
  status: TouristBookingStatus;
}): Promise<ProviderBooking> {
  return updateProviderBookingStatusMock(input.id, input.status);
}
