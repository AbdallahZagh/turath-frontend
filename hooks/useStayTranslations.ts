import type { TranslationValues } from "next-intl";
import { useCallback } from "react";

import { useTranslations } from "@/i18n/translations";
import { useProviderPreviewStore } from "@/store/providerPreviewStore";

/**
 * Hotel businesses get hotel wording: نزيل in Arabic, Check-in / Check-out in English. Every
 * other business keeps ضيف and its own schedule words (docs/PAGES.md, people words).
 */
export type ProviderStay = "hotel" | "other";

export function useProviderStay(): ProviderStay {
  return useProviderPreviewStore((state) => state.category) === "hotels" ? "hotel" : "other";
}

type StayNamespace = "provider.bookings" | "provider.checkIn" | "provider.profile";

type StayKey<N extends StayNamespace> = Parameters<ReturnType<typeof useTranslations<N>>>[0];

/** Translate a key in a business namespace; `stay` is always supplied, so callers never pass it. */
export type StayTranslator<N extends StayNamespace> = (
  key: StayKey<N>,
  values?: Omit<TranslationValues, "stay">,
) => string;

/**
 * `useTranslations` for business screens. Both locales use the same
 * `{stay, select, hotel {…} other {…}}` messages, and every call gets `stay` from the business
 * category. One overload per namespace keeps each screen's keys checked.
 */
export function useStayTranslations(
  namespace: "provider.bookings",
): StayTranslator<"provider.bookings">;
export function useStayTranslations(
  namespace: "provider.checkIn",
): StayTranslator<"provider.checkIn">;
export function useStayTranslations(
  namespace: "provider.profile",
): StayTranslator<"provider.profile">;
export function useStayTranslations(namespace: StayNamespace): StayTranslator<StayNamespace> {
  const t = useTranslations(namespace);
  const stay = useProviderStay();
  return useCallback((key, values) => t(key, { ...values, stay }), [t, stay]);
}
