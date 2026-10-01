"use client";

import type { ReactNode } from "react";

import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { useTranslations } from "@/i18n/translations";
import type { LedgerStanding } from "@/lib/mock/adminLedger";

const STANDING_BADGE: Record<LedgerStanding, { variant: BadgeVariant; className?: string }> = {
  healthy: { variant: "solid" },
  watch: { variant: "warning" },
  grace: { variant: "outline", className: "text-destructive border-destructive" },
  suspended: { variant: "outline", className: "text-destructive border-destructive" },
};

/** Account standing in the business wording and colours; the warning explains its 75% rule. */
export function LedgerStandingBadge({ standing }: { standing: LedgerStanding }): ReactNode {
  const t = useTranslations("admin.ledger");
  return (
    <Badge
      {...STANDING_BADGE[standing]}
      tooltip={standing === "watch" ? t("watchTooltip") : undefined}
    >
      {t(`standing.${standing}`)}
    </Badge>
  );
}
