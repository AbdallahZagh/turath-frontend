import {
  createAdminPromotion as insertPromotion,
  deleteAdminPromotion as removePromotion,
  listAdminPromotions as readPromotions,
  updateAdminPromotion as patchPromotion,
  type AdminPromotion,
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
