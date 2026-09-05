import {
  createAdminAttraction as insertAdminAttraction,
  deleteAdminAttraction as removeAdminAttraction,
  getAdminAttraction as readAdminAttraction,
  listAdminAttractions as readAdminAttractions,
  updateAdminAttraction as writeAdminAttraction,
  type AdminAttraction,
  type CreateAdminAttractionInput,
  type UpdateAdminAttractionInput,
} from "@/lib/mock/adminAttractions";

export async function listAdminAttractions(): Promise<AdminAttraction[]> {
  return readAdminAttractions();
}

export async function getAdminAttraction(id: string): Promise<AdminAttraction | null> {
  return readAdminAttraction(id) ?? null;
}

export async function createAdminAttraction(
  input: CreateAdminAttractionInput,
): Promise<AdminAttraction> {
  return insertAdminAttraction(input);
}

export async function updateAdminAttraction(
  id: string,
  input: UpdateAdminAttractionInput,
): Promise<AdminAttraction> {
  return writeAdminAttraction(id, input);
}

export async function deleteAdminAttraction(id: string): Promise<void> {
  return removeAdminAttraction(id);
}
