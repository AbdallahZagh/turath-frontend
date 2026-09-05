"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { fadeUp, viewportOnce } from "@/lib/motion/variants";

export function ContactUs(): ReactNode {
  const t = useTranslations("landing.contactUs");

  return (
    <section id="contact-us" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        className="mx-auto max-w-5xl"
      >
        <GlassPanel className="relative p-8 sm:p-12">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_auto]">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="bg-accent h-px w-8" aria-hidden />
                <p className="text-accent text-xs font-semibold tracking-[0.14em] uppercase">
                  {t("eyebrow")}
                </p>
              </div>
              <h2 className="font-heading text-prose mt-4 text-3xl leading-[1.15] font-semibold text-balance sm:text-4xl lg:text-[2.75rem]">
                {t("title")}
              </h2>
              <p className="text-prose-muted mt-4 max-w-md text-base leading-relaxed sm:text-lg">
                {t("subtitle")}
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <Button href="/contact" variant="solid" size="lg">
                <Mail className="size-4" aria-hidden />
                {t("cta")}
              </Button>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </section>
  );
}
