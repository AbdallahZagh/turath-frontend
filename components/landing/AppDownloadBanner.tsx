"use client";

import { motion } from "framer-motion";
import { Apple, MapPinned, PlayCircle, QrCode } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { fadeUp, viewportOnce } from "@/lib/motion/variants";

type PhoneMockupProps = {
  children: ReactNode;
  delay: number;
};

function PhoneMockup({ children, delay }: PhoneMockupProps): ReactNode {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.7, delay }}
    >
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
        className="glass-surface backdrop-blur-sm border-glass-border flex h-105 w-55 flex-col items-center justify-center gap-4 rounded-[2.5rem] border-2 p-4 sm:h-120 sm:w-62.5"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function AppDownloadBanner(): ReactNode {
  const t = useTranslations("landing.appDownload");

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="order-2 flex justify-center gap-6 lg:order-1"
        >
          <PhoneMockup delay={0}>
            <QrCode className="text-primary size-20 sm:size-24" aria-hidden />
            <span className="text-prose-muted text-center text-xs font-medium">
              {t("offlineQrLabel")}
            </span>
          </PhoneMockup>
          <PhoneMockup delay={0.4}>
            <MapPinned className="text-accent size-20 sm:size-24" aria-hidden />
            <span className="text-prose-muted text-center text-xs font-medium">
              {t("offlineMapLabel")}
            </span>
          </PhoneMockup>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="order-1 text-center lg:order-2 lg:text-start"
        >
          <div className="flex items-center justify-center gap-2.5 lg:justify-start">
            <span className="bg-accent h-px w-8" aria-hidden />
            <p className="text-accent text-xs font-semibold tracking-[0.14em] uppercase">
              {t("eyebrow")}
            </p>
          </div>
          <h2 className="font-heading text-prose mt-4 text-3xl leading-[1.15] font-semibold text-balance sm:text-4xl lg:text-[2.75rem]">
            {t("title")}
          </h2>
          <p className="text-prose-muted mx-auto mt-4 max-w-md text-base leading-relaxed sm:text-lg lg:mx-0">
            {t("subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <span className="glass-surface backdrop-blur-sm text-prose flex items-center gap-2 rounded-[0.9375em] px-5 py-3 text-sm font-medium">
              <Apple className="size-5" aria-hidden />
              {t("appStore")}
            </span>
            <span className="glass-surface backdrop-blur-sm text-prose flex items-center gap-2 rounded-[0.9375em] px-5 py-3 text-sm font-medium">
              <PlayCircle className="size-5" aria-hidden />
              {t("googlePlay")}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
