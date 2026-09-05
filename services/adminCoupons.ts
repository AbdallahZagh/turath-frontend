import {
  createAdminCoupon as insertCoupon,
  deleteAdminCoupon as removeCoupon,
  listAdminCoupons as readCoupons,
  updateAdminCoupon as patchCoupon,
  type AdminCoupon,
  type SaveAdminCouponInput,
} from "@/lib/mock/adminCoupons";

export async function listAdminCoupons(): Promise<AdminCoupon[]> {
  return readCoupons();
}

export async function createAdminCoupon(
  input: SaveAdminCouponInput,
): Promise<AdminCoupon> {
  return insertCoupon(input);
}

export async function updateAdminCoupon(
  id: string,
  input: SaveAdminCouponInput,
): Promise<AdminCoupon> {
  return patchCoupon(id, input);
}

export async function deleteAdminCoupon(id: string): Promise<void> {
  return removeCoupon(id);
}
