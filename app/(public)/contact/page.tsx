import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ContactForm } from "@/components/contact/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return {
    title: `${t("title")} | Turath`,
    description: t("lead"),
  };
}

export default async function ContactPage(): Promise<ReactNode> {
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-28">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <div className="flex items-center justify-center gap-2.5">
          <span className="bg-accent h-px w-8" aria-hidden />
          <p className="text-accent text-xs font-semibold tracking-[0.14em] uppercase">
            {t("title")}
          </p>
        </div>
        <h1 className="font-heading text-prose mt-4 text-3xl leading-[1.15] font-semibold text-balance sm:text-4xl lg:text-[2.75rem]">
          {t("title")}
        </h1>
        <p className="text-prose-muted mt-4 text-base leading-relaxed sm:text-lg">{t("lead")}</p>
      </div>
      <ContactForm />
    </div>
  );
}
