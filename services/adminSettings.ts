import {
  getAdminSettings,
  saveAdminSettings,
  type AdminSettings,
} from "@/lib/mock/adminSettings";

export async function listAdminSettings(): Promise<AdminSettings> {
  return getAdminSettings();
}

export async function updateAdminSettings(
  input: AdminSettings,
): Promise<AdminSettings> {
  return saveAdminSettings(input);
}
