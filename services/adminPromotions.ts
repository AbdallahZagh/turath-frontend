import {
  createAdminPromotion as insertPromotion,
  deleteAdminPromotion as removePromotion,
  listAdminPromotions as readPromotions,
  listLiveFeaturedForSlot as readLiveForSlot,
  updateAdminPromotion as patchPromotion,
  type AdminPromotion,
  type FeaturedSlotId,
  type SaveAdminPromotionInput,
} from "@/lib/mock/adminPromotions";

export async function listAdminPromotions(): Promise<AdminPromotion[]> {
  return readPromotions();
}

export async function createAdminPromotion(
  input: SaveAdminPromotionInput,
): Promise<AdminPromotion> {
  return insertPromotion(input);
}

export async function updateAdminPromotion(
  id: string,
  input: SaveAdminPromotionInput,
): Promise<AdminPromotion> {
  return patchPromotion(id, input);
}

export async function deleteAdminPromotion(id: string): Promise<void> {
  removePromotion(id);
}

export async function listLiveFeaturedForSlot(
  slot: FeaturedSlotId,
): Promise<AdminPromotion[]> {
  return readLiveForSlot(slot);
}
