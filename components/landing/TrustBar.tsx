"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion/variants";
import { TRUST_BAR_ITEMS, type TrustBarItemId } from "@/lib/mock/landing";

type TrustBarTitleKey =
  | "cashOnArrivalTitle"
  | "offlineQrTitle"
  | "licensedProvidersTitle"
  | "dualCurrencyTitle";

type TrustBarBodyKey =
  | "cashOnArrivalBody"
  | "offlineQrBody"
  | "licensedProvidersBody"
  | "dualCurrencyBody";

const TITLE_KEY: Record<TrustBarItemId, TrustBarTitleKey> = {
  cashOnArrival: "cashOnArrivalTitle",
  offlineQr: "offlineQrTitle",
  licensedProviders: "licensedProvidersTitle",
  dualCurrency: "dualCurrencyTitle",
};

const BODY_KEY: Record<TrustBarItemId, TrustBarBodyKey> = {
  cashOnArrival: "cashOnArrivalBody",
  offlineQr: "offlineQrBody",
  licensedProviders: "licensedProvidersBody",
  dualCurrency: "dualCurrencyBody",
};

export function TrustBar(): ReactNode {
  const t = useTranslations("landing.trustBar");

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2.5"
        >
          <span className="bg-accent h-px w-8" aria-hidden />
          <p className="text-accent text-xs font-semibold tracking-[0.14em] uppercase">
            {t("eyebrow")}
          </p>
          <span className="bg-accent h-px w-8" aria-hidden />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="glass-surface backdrop-blur-sm rounded-glass divide-glass-border mt-8 grid grid-cols-1 divide-y lg:grid-cols-4 lg:divide-x lg:divide-y-0"
        >
          {TRUST_BAR_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                variants={fadeUp}
                className="flex flex-col gap-3 p-6 sm:p-7"
              >
                <Icon className="text-accent size-6" aria-hidden />
                <h3 className="font-heading text-prose text-base font-semibold">
                  {t(TITLE_KEY[item.id])}
                </h3>
                <p className="text-prose-muted text-sm leading-relaxed">
                  {t(BODY_KEY[item.id])}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
