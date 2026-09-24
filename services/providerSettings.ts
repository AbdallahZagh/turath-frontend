import {
  getProviderSettings as getProviderSettingsMock,
  updateProviderSettings as updateProviderSettingsMock,
  type ProviderSettings,
} from "@/lib/mock/providerSettings";
import type { ProviderSettingsValues } from "@/lib/validation/providerSettings";

export async function getProviderSettings(): Promise<ProviderSettings> {
  return getProviderSettingsMock();
}

export async function updateProviderSettings(
  values: ProviderSettingsValues,
): Promise<ProviderSettings> {
  return updateProviderSettingsMock(values);
}
