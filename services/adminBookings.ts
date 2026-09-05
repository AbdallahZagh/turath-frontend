import {
  ADMIN_BOOKINGS,
  updateAdminBookingStatus as updateMockStatus,
  type AdminBooking,
  type BookingStatus,
} from "@/lib/mock/adminBookings";

export async function listAdminBookings(): Promise<AdminBooking[]> {
  return ADMIN_BOOKINGS;
}

export async function updateAdminBookingStatus(
  id: string,
  status: BookingStatus,
): Promise<AdminBooking> {
  return updateMockStatus(id, status);
}
