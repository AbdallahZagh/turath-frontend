import {
  getProviderProfile as getProviderProfileMock,
  updateProviderProfile as updateProviderProfileMock,
  type ProviderProfile,
} from "@/lib/mock/providerProfile";
import type { ProviderProfileValues } from "@/lib/validation/providerProfile";
import type { ProviderCategory } from "@/lib/validation/auth";

export async function getProviderProfile(category: ProviderCategory): Promise<ProviderProfile> {
  return getProviderProfileMock(category);
}

export async function updateProviderProfile(
  category: ProviderCategory,
  values: ProviderProfileValues,
): Promise<ProviderProfile> {
  return updateProviderProfileMock(category, values);
}
