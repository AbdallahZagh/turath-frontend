import { Flame, Phone, ShieldAlert, Siren, type LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/logo/Logo";
import { EMERGENCY_HOTLINES, type EmergencyHotlineId } from "@/lib/mock/landing";

const HOTLINE_ICONS: Record<EmergencyHotlineId, LucideIcon> = {
  police: ShieldAlert,
  ambulance: Siren,
  touristPolice: ShieldAlert,
  fire: Flame,
};

type CategoryLabelKey =
  | "categoryHotels"
  | "categoryDining"
  | "categoryTrips"
  | "categoryEvents"
  | "categoryGuides";

type LegalLabelKey = "legalTerms" | "legalPrivacy" | "legalLicensing";

type FooterLink<LabelKey extends string> = { href: string; labelKey: LabelKey };

const CATEGORY_LINKS: FooterLink<CategoryLabelKey>[] = [
  { href: "/hotels", labelKey: "categoryHotels" },
  { href: "/restaurants", labelKey: "categoryDining" },
  { href: "/trips", labelKey: "categoryTrips" },
  { href: "/events", labelKey: "categoryEvents" },
  { href: "/guides", labelKey: "categoryGuides" },
];

const LEGAL_LINKS: FooterLink<LegalLabelKey>[] = [
  { href: "/legal/terms", labelKey: "legalTerms" },
  { href: "/legal/privacy", labelKey: "legalPrivacy" },
  { href: "/legal/provider-licensing", labelKey: "legalLicensing" },
];

export async function PublicFooter(): Promise<ReactNode> {
  const t = await getTranslations("landing.footer");
  const tHotlines = await getTranslations("landing.footer.hotlines");
  const year = new Date().getFullYear();

  return (
    <footer className="border-border/60 bg-app-muted/40 border-t">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="col-span-2">
            <Logo variant="main" className="h-18" />
            <p className="text-prose-muted mt-3 max-w-xs text-sm leading-relaxed">
              {t("tagline")}
            </p>
          </div>

          <nav aria-label={t("categoriesHeading")}>
            <h3 className="text-prose text-sm font-semibold">
              {t("categoriesHeading")}
            </h3>
            <ul className="mt-4 space-y-3">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-prose-muted hover:text-prose text-sm transition-colors"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("companyHeading")}>
            <h3 className="text-prose text-sm font-semibold">{t("companyHeading")}</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="#grow-with-turath"
                  className="text-prose-muted hover:text-prose text-sm transition-colors"
                >
                  {t("companyPartner")}
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-prose-muted hover:text-prose text-sm transition-colors"
                >
                  {t("companyContact")}
                </Link>
              </li>
            </ul>
            <h3 className="text-prose mt-8 text-sm font-semibold">
              {t("legalHeading")}
            </h3>
            <ul className="mt-4 space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-prose-muted hover:text-prose text-sm transition-colors"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-prose text-sm font-semibold">
              {t("hotlinesHeading")}
            </h3>
            <ul className="mt-4 space-y-3">
              {EMERGENCY_HOTLINES.map((hotline) => {
                const Icon = HOTLINE_ICONS[hotline.id];
                return (
                  <li key={hotline.id} className="flex items-center gap-2 text-sm">
                    <Icon className="text-accent size-4 shrink-0" aria-hidden />
                    <span className="text-prose-muted">{tHotlines(hotline.id)}</span>
                    <a
                      href={`tel:${hotline.phone}`}
                      className="text-prose ms-auto inline-flex items-center gap-1 font-medium"
                    >
                      <Phone className="size-3" aria-hidden />
                      {hotline.phone}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="border-border/60 mt-12 border-t pt-6">
          <p className="text-prose-muted text-xs">{t("copyright", { year })}</p>
        </div>
      </div>
    </footer>
  );
}
