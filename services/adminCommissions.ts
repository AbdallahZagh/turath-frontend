import {
  getAdminCommissions,
  saveAdminCommissions,
  type AdminCommissions,
  type SaveAdminCommissionsInput,
} from "@/lib/mock/adminCommissions";

export async function listAdminCommissions(): Promise<AdminCommissions> {
  return getAdminCommissions();
}

export async function updateAdminCommissions(
  input: SaveAdminCommissionsInput,
): Promise<AdminCommissions> {
  return saveAdminCommissions(input);
}
