"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { useTouristAccount } from "@/hooks/useTouristAccount";
import { RELIABILITY_PROVIDER_ACCEPTANCE_BELOW } from "@/lib/mock/touristAccount";

export function BookingReliabilityNotice(): ReactNode {
  const t = useTranslations("bookingReliability");
  const accountQuery = useTouristAccount();
  const score = accountQuery.data?.reliabilityScore;

  if (typeof score !== "number" || score >= RELIABILITY_PROVIDER_ACCEPTANCE_BELOW) {
    return null;
  }

  return (
    <section className="border-warning/30 bg-warning/8 rounded-2xl border p-5">
      <div className="flex gap-3">
        <AlertTriangle className="text-warning size-5 shrink-0" aria-hidden />
        <div>
          <p className="text-prose font-semibold">{t("title")}</p>
          <p className="text-prose-muted mt-1 text-sm leading-relaxed">{t("description")}</p>
        </div>
      </div>
    </section>
  );
}
