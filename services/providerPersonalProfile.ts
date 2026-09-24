import {
  getProviderPersonalProfile as getProviderPersonalProfileMock,
  updateProviderPersonalProfile as updateProviderPersonalProfileMock,
  type ProviderAccountRole,
  type ProviderOwnerPersonalProfile,
  type ProviderPersonalProfile,
} from "@/lib/mock/providerPersonalProfile";
import type { ProviderPersonalProfileValues } from "@/lib/validation/providerPersonalProfile";

export async function getProviderPersonalProfile(
  role: ProviderAccountRole,
): Promise<ProviderPersonalProfile> {
  return getProviderPersonalProfileMock(role);
}

export async function updateProviderPersonalProfile(input: {
  values: ProviderPersonalProfileValues;
}): Promise<ProviderOwnerPersonalProfile> {
  return updateProviderPersonalProfileMock(input.values);
}
