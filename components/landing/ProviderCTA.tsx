"use client";

import { motion } from "framer-motion";
import { Building2, QrCode, ReceiptText } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { fadeUp, viewportOnce } from "@/lib/motion/variants";

const BENEFITS = [
  { icon: Building2, key: "benefitDashboard" },
  { icon: QrCode, key: "benefitScanner" },
  { icon: ReceiptText, key: "benefitLedger" },
] as const;

export function ProviderCTA(): ReactNode {
  const t = useTranslations("landing.providerCta");

  return (
    <section id="grow-with-turath" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        className="mx-auto max-w-5xl"
      >
        <GlassPanel className="relative p-8 sm:p-12">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
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

              <ul className="mt-7 flex flex-col gap-3.5">
                {BENEFITS.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <li key={benefit.key} className="flex items-start gap-3">
                      <span className="bg-app-muted text-primary mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <span className="text-prose text-sm">{t(benefit.key)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex justify-center lg:justify-end">
              <Button href="/provider/register" variant="solid" size="lg">
                {t("cta")}
              </Button>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </section>
  );
}
