import { ScrollText } from "lucide-react";
import type { ReactNode } from "react";

import { BOOKING_POLICY_LINK_TAGS } from "@/components/auth/termsLinkTags";
import { useTranslations } from "@/i18n/translations";

/** Checkout link to /legal/booking-policy (docs/PAGES.md §3). */
export function BookingPolicyNote(): ReactNode {
  const t = useTranslations("bookings");
  return (
    <p className="text-prose-muted flex gap-2 text-sm leading-relaxed">
      <ScrollText className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{t.rich("policyNote", BOOKING_POLICY_LINK_TAGS)}</span>
    </p>
  );
}
