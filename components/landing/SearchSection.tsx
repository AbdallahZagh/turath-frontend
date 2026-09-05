import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { OmniSearchWidget } from "./OmniSearchWidget";
import { SectionHeading } from "./SectionHeading";

export async function SearchSection(): Promise<ReactNode> {
  const t = await getTranslations("landing.search");

  return (
    <section id="search" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow={t("sectionEyebrow")}
          title={t("sectionTitle")}
          subtitle={t("sectionSubtitle")}
        />
        <div className="mt-10">
          <OmniSearchWidget />
        </div>
      </div>
    </section>
  );
}
