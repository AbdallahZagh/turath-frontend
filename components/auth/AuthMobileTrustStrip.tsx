"use client";

import { QrCode, ShieldCheck, Wallet, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

const TRUST_ITEMS: {
  key: "cashOnArrivalTitle" | "offlineQrTitle" | "licensedProvidersTitle";
  icon: LucideIcon;
}[] = [
  { key: "cashOnArrivalTitle", icon: Wallet },
  { key: "offlineQrTitle", icon: QrCode },
  { key: "licensedProvidersTitle", icon: ShieldCheck },
];

/** Compact trust cues for auth screens below lg (showcase pane is lg+ only). */
export function AuthMobileTrustStrip(): ReactNode {
  const t = useTranslations("landing.trustBar");
  const tAuth = useTranslations("auth");

  return (
    <div
      className="mt-6 w-full max-w-2xl lg:hidden"
      role="group"
      aria-label={tAuth("trustStripLabel")}
    >
      <ul className="glass-surface glass-frost backdrop-blur-sm rounded-glass flex flex-col gap-2.5 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-3.5">
        {TRUST_ITEMS.map(({ key, icon: Icon }) => (
          <li
            key={key}
            className="text-prose-muted flex min-h-11 items-center gap-2.5 text-xs font-medium sm:min-h-0 sm:flex-1"
          >
            <span className="bg-glass flex size-8 shrink-0 items-center justify-center rounded-full">
              <Icon className="text-accent size-3.5" aria-hidden />
            </span>
            <span className="leading-snug">{t(key)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
