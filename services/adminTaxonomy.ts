import {
  createAdminTaxonomyTerm as insertTerm,
  deleteAdminTaxonomyTerm as removeTerm,
  listAdminTaxonomy as readTerms,
  moveAdminTaxonomyTerm as shiftTerm,
  updateAdminTaxonomyTerm as patchTerm,
  type AdminTaxonomyTerm,
  type SaveAdminTaxonomyTermInput,
} from "@/lib/mock/adminTaxonomy";

export async function listAdminTaxonomy(): Promise<AdminTaxonomyTerm[]> {
  return readTerms();
}

export async function createAdminTaxonomyTerm(
  input: SaveAdminTaxonomyTermInput,
): Promise<AdminTaxonomyTerm> {
  return insertTerm(input);
}

export async function updateAdminTaxonomyTerm(
  id: string,
  input: SaveAdminTaxonomyTermInput,
): Promise<AdminTaxonomyTerm> {
  return patchTerm(id, input);
}

export async function moveAdminTaxonomyTerm(
  id: string,
  direction: -1 | 1,
): Promise<AdminTaxonomyTerm[]> {
  return shiftTerm(id, direction);
}

export async function deleteAdminTaxonomyTerm(
  id: string,
): Promise<AdminTaxonomyTerm[]> {
  return removeTerm(id);
}
