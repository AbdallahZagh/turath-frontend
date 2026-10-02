import {
  getProviderProfile as getProviderProfileMock,
  getSignedInProviderProfile as getSignedInProviderProfileMock,
  updateProviderProfile as updateProviderProfileMock,
  type ProviderProfile,
} from "@/lib/mock/providerProfile";
import type { ProviderProfileValues } from "@/lib/validation/providerProfile";
import type { ProviderCategory } from "@/lib/validation/auth";

export async function getProviderProfile(category: ProviderCategory): Promise<ProviderProfile> {
  return getProviderProfileMock(category);
}

/** The signed-in business's own profile; its category drives the whole business portal. */
export async function getSignedInProviderProfile(): Promise<ProviderProfile> {
  return getSignedInProviderProfileMock();
}

export async function updateProviderProfile(
  category: ProviderCategory,
  values: ProviderProfileValues,
): Promise<ProviderProfile> {
  return updateProviderProfileMock(category, values);
}
