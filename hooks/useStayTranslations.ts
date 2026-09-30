import { useTranslations } from "next-intl";

import { useProviderProfile } from "@/hooks/useProviderProfile";

/** Hotel businesses say نزيل in Arabic; every other business says ضيف (docs/PAGES.md, people words). */
export type ProviderStay = "hotel" | "other";

export function useProviderStay(): ProviderStay {
  return useProviderProfile().data?.category === "hotels" ? "hotel" : "other";
}

type StayNamespace = "provider.bookings" | "provider.checkIn";

/**
 * `useTranslations` for business booking screens. Adds `stay` to every call so the Arabic
 * hotel/other select resolves; English has no such argument, hence the untyped inner call.
 */
export function useStayTranslations<N extends StayNamespace>(
  namespace: N,
): ReturnType<typeof useTranslations<N>> {
  const t = useTranslations(namespace) as unknown as (
    key: string,
    values?: Record<string, unknown>,
  ) => string;
  const stay = useProviderStay();
  const withStay = (key: string, values?: Record<string, unknown>): string =>
    t(key, { stay, ...values });
  return withStay as unknown as ReturnType<typeof useTranslations<N>>;
}
