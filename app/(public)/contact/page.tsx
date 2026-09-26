import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { PageHeader } from "@/components/ui/PageHeader";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact.headers.index");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ContactPage(): ReactNode {
  return (
    <div className="mx-auto max-w-4/5 px-4 pt-32 pb-20 sm:px-6 sm:pt-36 sm:pb-24 lg:px-8">
      <PageHeader />

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
