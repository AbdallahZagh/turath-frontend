"use client";

import { motion } from "framer-motion";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { fadeUp } from "@/lib/motion/variants";

export function ContactInfo(): ReactNode {
  const t = useTranslations("contact.info");

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="h-full">
      <GlassPanel className="flex h-full flex-col justify-between p-6 sm:p-8 lg:p-9">
        <div>
          <h2 className="font-heading text-prose text-2xl font-semibold sm:text-3xl">
            {t("title")}
          </h2>
          <p className="text-prose-muted mt-2 text-sm leading-relaxed sm:text-base">
            {t("lead")}
          </p>

          <div className="mt-8 flex flex-col gap-6">
            {/* Phone */}
            <div className="flex items-start gap-3.5">
              <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                <Phone className="size-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-prose-muted text-xs font-medium uppercase tracking-wider">
                  {t("phone")}
                </p>
                <a
                  href={`tel:${t("phoneValue").replace(/\s+/g, "")}`}
                  className="text-prose hover:text-accent mt-0.5 inline-block text-sm font-semibold transition-colors sm:text-base"
                  dir="ltr"
                >
                  {t("phoneValue")}
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-3.5">
              <div className="bg-accent/15 text-accent flex size-10 shrink-0 items-center justify-center rounded-xl">
                <MessageCircle className="size-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-prose-muted text-xs font-medium uppercase tracking-wider">
                  {t("whatsapp")}
                </p>
                <a
                  href={`https://wa.me/${t("whatsappValue").replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-prose hover:text-accent mt-0.5 inline-block text-sm font-semibold transition-colors sm:text-base"
                  dir="ltr"
                >
                  {t("whatsappValue")}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3.5">
              <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                <Mail className="size-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-prose-muted text-xs font-medium uppercase tracking-wider">
                  {t("email")}
                </p>
                <a
                  href={`mailto:${t("emailValue")}`}
                  className="text-prose hover:text-accent mt-0.5 inline-block text-sm font-semibold transition-colors sm:text-base"
                >
                  {t("emailValue")}
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3.5">
              <div className="bg-sand/20 text-warning flex size-10 shrink-0 items-center justify-center rounded-xl">
                <MapPin className="size-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-prose-muted text-xs font-medium uppercase tracking-wider">
                  {t("location")}
                </p>
                <p className="text-prose mt-0.5 text-sm font-medium leading-relaxed sm:text-base">
                  {t("locationValue")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Working Hours Footnote */}
        <div className="border-border/60 bg-app-muted/30 mt-8 flex items-center gap-3 rounded-2xl border p-4">
          <Clock className="text-accent size-5 shrink-0" aria-hidden />
          <div className="min-w-0">
            <p className="text-prose-muted text-xs font-medium">{t("hours")}</p>
            <p className="text-prose text-xs font-semibold sm:text-sm">{t("hoursValue")}</p>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
