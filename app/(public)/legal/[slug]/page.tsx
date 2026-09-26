import { BadgeCheck, LockKeyhole, ScrollText, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { PageHeader } from "@/components/ui/PageHeader";

const LEGAL_PAGES = {
  terms: {
    pageKey: "terms",
    icon: ScrollText,
    sections: [
      "pages.terms.sections.agreement",
      "pages.terms.sections.bookings",
      "pages.terms.sections.responsibilities",
      "pages.terms.sections.changes",
    ],
  },
  privacy: {
    pageKey: "privacy",
    icon: LockKeyhole,
    sections: [
      "pages.privacy.sections.collection",
      "pages.privacy.sections.use",
      "pages.privacy.sections.sharing",
      "pages.privacy.sections.choices",
    ],
  },
  "provider-licensing": {
    pageKey: "providerLicensing",
    icon: BadgeCheck,
    sections: [
      "pages.providerLicensing.sections.verification",
      "pages.providerLicensing.sections.documents",
      "pages.providerLicensing.sections.standards",
      "pages.providerLicensing.sections.status",
    ],
  },
} as const satisfies Record<string, {
  pageKey: "terms" | "privacy" | "providerLicensing";
  icon: LucideIcon;
  sections: readonly string[];
}>;

type LegalSlug = keyof typeof LEGAL_PAGES;

function isLegalSlug(slug: string): slug is LegalSlug {
  return slug in LEGAL_PAGES;
}

export function generateStaticParams(): Array<{ slug: LegalSlug }> {
  return (Object.keys(LEGAL_PAGES) as LegalSlug[]).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isLegalSlug(slug)) notFound();
  const t = await getTranslations("legal");
  const pageKey = LEGAL_PAGES[slug].pageKey;
  return {
    title: t(`headers.${pageKey}.title`),
    description: t(`headers.${pageKey}.description`),
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<ReactNode> {
  const { slug } = await params;
  if (!isLegalSlug(slug)) notFound();

  const t = await getTranslations("legal");
  const page = LEGAL_PAGES[slug];
  const Icon = page.icon;

  return (
    <div className="mx-auto max-w-[78rem] px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8">
      <PageHeader />
      <GlassPanel className="mb-6 flex items-start gap-4 p-5 sm:p-6">
        <span className="bg-primary/12 text-primary grid size-12 shrink-0 place-items-center rounded-2xl">
          <Icon className="size-6" aria-hidden />
        </span>
        <div>
          <p className="text-prose font-semibold">{t("updatedLabel")}</p>
          <p className="text-prose-muted mt-1 text-sm">{t(`pages.${page.pageKey}.updated`)}</p>
          <p className="text-prose-muted mt-3 text-sm leading-relaxed">{t(`pages.${page.pageKey}.introduction`)}</p>
        </div>
      </GlassPanel>

      <div className="space-y-5">
        {page.sections.map((section) => (
          <GlassPanel key={section} className="p-6 sm:p-8">
            <h2 className="font-heading text-prose text-2xl font-semibold">
              {t(`${section}.title`)}
            </h2>
            <p className="text-prose-muted mt-3 max-w-4xl text-sm leading-7 sm:text-base">
              {t(`${section}.body`)}
            </p>
          </GlassPanel>
        ))}
      </div>

      <p className="text-prose-muted mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed">
        {t("contactNotice")}
      </p>
    </div>
  );
}
