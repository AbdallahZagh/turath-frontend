import { z } from "zod";

export const PROVIDER_LANGUAGES = ["en", "ar"] as const;
export const PROVIDER_TIMEZONES = ["Asia/Damascus", "Asia/Riyadh", "UTC"] as const;
export const PROVIDER_CURRENCY_DISPLAYS = ["sypWithUsd", "sypOnly"] as const;

export const providerSettingsSchema = z.object({
  notifications: z.object({
    newBookings: z.boolean(),
    bookingChanges: z.boolean(),
    arrivalReminders: z.boolean(),
    guestReviews: z.boolean(),
    financeReminders: z.boolean(),
  }),
  language: z.enum(PROVIDER_LANGUAGES),
  timezone: z.enum(PROVIDER_TIMEZONES),
  currencyDisplay: z.enum(PROVIDER_CURRENCY_DISPLAYS),
});

export type ProviderSettingsValues = z.infer<typeof providerSettingsSchema>;
