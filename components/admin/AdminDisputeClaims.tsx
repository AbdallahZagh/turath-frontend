"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Building2, UserRound } from "lucide-react";

import { GlassPanel } from "@/components/ui/GlassPanel";
import type { Locale } from "@/i18n/config";
import { localizedName } from "@/lib/i18n/localized";
import type { AdminDispute } from "@/lib/mock/adminDisputes";

type AdminDisputeClaimsProps = {
  dispute: AdminDispute;
};

export function AdminDisputeClaims({ dispute }: AdminDisputeClaimsProps): ReactNode {
  const t = useTranslations("admin.disputes");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const other: Locale = loc === "ar" ? "en" : "ar";

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-prose text-lg font-semibold">{t("detail.claimsTitle")}</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassPanel className="flex-none gap-3 p-5 sm:p-6">
          <div className="text-prose-muted flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
            <Building2 className="text-accent size-4" aria-hidden />
            <span>{t("providerLabel")}</span>
          </div>
          <p className="text-prose text-sm leading-relaxed">
            {localizedName(dispute.providerClaim, loc)}
          </p>
          <p className="text-prose-muted text-sm leading-relaxed">
            {localizedName(dispute.providerClaim, other)}
          </p>
        </GlassPanel>
        <GlassPanel className="flex-none gap-3 p-5 sm:p-6">
          <div className="text-prose-muted flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
            <UserRound className="text-accent size-4" aria-hidden />
            <span>{t("touristLabel")}</span>
          </div>
          <p className="text-prose text-sm leading-relaxed">
            {localizedName(dispute.touristClaim, loc)}
          </p>
          <p className="text-prose-muted text-sm leading-relaxed">
            {localizedName(dispute.touristClaim, other)}
          </p>
        </GlassPanel>
      </div>
    </section>
  );
}
