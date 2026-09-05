import { toIsoDate } from "@/lib/format/datetime";
import {
  listAdminBookingsByPhone,
  type AdminBooking,
} from "@/lib/mock/adminBookings";
import { listReviewsAboutGuest, type AdminReview } from "@/lib/mock/adminReviews";
import { buildUserActivity, type AdminUserActivityEvent } from "@/lib/mock/adminUserActivity";
import {
  getAdminUser as readAdminUser,
  listAdminUsers as readAdminUsers,
  setAdminUserLocked as writeAdminUserLocked,
  type AdminUser,
} from "@/lib/mock/adminUsers";

export type AdminUserDetailData = {
  user: AdminUser;
  bookings: AdminBooking[];
  activity: AdminUserActivityEvent[];
  reviews: AdminReview[];
};

export async function listAdminUsers(): Promise<AdminUser[]> {
  return readAdminUsers();
}

export async function getAdminUserDetail(
  id: string,
): Promise<AdminUserDetailData | null> {
  const user = readAdminUser(id);
  if (!user) {
    return null;
  }

  const bookings = listAdminBookingsByPhone(user.phone);
  return {
    user,
    bookings,
    activity: buildUserActivity(user, bookings),
    reviews: listReviewsAboutGuest(user.name.en),
  };
}

export async function setAdminUserLocked(
  id: string,
  locked: boolean,
): Promise<AdminUser> {
  return writeAdminUserLocked(id, locked, toIsoDate(new Date()));
}
