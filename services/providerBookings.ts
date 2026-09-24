import type { TouristBookingStatus } from "@/lib/mock/bookings";
import {
  getProviderBooking as getProviderBookingMock,
  listProviderBookings as listProviderBookingsMock,
  updateProviderBookingStatus as updateProviderBookingStatusMock,
  type ProviderBooking,
} from "@/lib/mock/providerBookings";

export async function listProviderBookings(): Promise<ProviderBooking[]> {
  return listProviderBookingsMock();
}

export async function getProviderBooking(id: string): Promise<ProviderBooking | null> {
  return getProviderBookingMock(id) ?? null;
}

export async function updateProviderBookingStatus(input: {
  id: string;
  status: TouristBookingStatus;
}): Promise<ProviderBooking> {
  return updateProviderBookingStatusMock(input.id, input.status);
}
