import {
  getProviderProfile as getProviderProfileMock,
  updateProviderProfile as updateProviderProfileMock,
  type ProviderProfile,
} from "@/lib/mock/providerProfile";
import type { ProviderProfileValues } from "@/lib/validation/providerProfile";

export async function getProviderProfile(): Promise<ProviderProfile> {
  return getProviderProfileMock();
}

export async function updateProviderProfile(
  values: ProviderProfileValues,
): Promise<ProviderProfile> {
  return updateProviderProfileMock(values);
}
