import type { ProviderSettingsValues } from "@/lib/validation/providerSettings";

export type ProviderSettings = ProviderSettingsValues;

let settings: ProviderSettings = {
  notifications: {
    newBookings: true,
    bookingChanges: true,
    arrivalReminders: true,
    guestReviews: true,
    financeReminders: true,
  },
  language: "en",
  timezone: "Asia/Damascus",
  currencyDisplay: "sypWithUsd",
};

function cloneSettings(value: ProviderSettings): ProviderSettings {
  return {
    ...value,
    notifications: { ...value.notifications },
  };
}

export function getProviderSettings(): ProviderSettings {
  return cloneSettings(settings);
}

export function updateProviderSettings(values: ProviderSettingsValues): ProviderSettings {
  settings = cloneSettings(values);
  return getProviderSettings();
}
