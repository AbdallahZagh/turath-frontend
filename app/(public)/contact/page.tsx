import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";

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
    <div className="mx-auto max-w-4/5 px-4 pt-32 pb-20 sm:px-6 sm:pt-36 sm:pb-24 lg:px-8">
      {/* Page Title & Subtitle */}
      <div className="mb-8 text-center sm:mb-12">
        <h1 className="font-heading text-prose text-3xl font-semibold sm:text-4xl lg:text-5xl">
          {t("title")}
        </h1>
        <p className="text-prose-muted mx-auto mt-3 max-w-xl text-base sm:text-lg">
          {t("lead")}
        </p>
      </div>

      {/* Side-by-Side: Info Card + Contact Form */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <ContactInfo />
        </div>
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
