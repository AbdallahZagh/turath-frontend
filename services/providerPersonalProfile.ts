import {
  getProviderPersonalProfile as getProviderPersonalProfileMock,
  updateProviderPersonalProfile as updateProviderPersonalProfileMock,
  type ProviderAccount,
  type ProviderOwnerPersonalProfile,
  type ProviderPersonalProfile,
} from "@/lib/mock/providerPersonalProfile";
import type { ProviderPersonalProfileValues } from "@/lib/validation/providerPersonalProfile";

export async function getProviderPersonalProfile(
  account: ProviderAccount,
): Promise<ProviderPersonalProfile> {
  return getProviderPersonalProfileMock(account);
}

export async function updateProviderPersonalProfile(input: {
  account: ProviderAccount;
  values: ProviderPersonalProfileValues;
}): Promise<ProviderOwnerPersonalProfile> {
  return updateProviderPersonalProfileMock(input.account, input.values);
}
