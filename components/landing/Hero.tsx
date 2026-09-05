"use client";

import { motion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const headline: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

export function Hero(): ReactNode {
  const t = useTranslations("landing.hero");

  return (
    <section className="relative isolate flex min-h-dvh flex-col justify-center overflow-hidden px-4 pt-28 pb-20 sm:px-6">
      <Image
        src="/images/landing/hero-damascus.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-30 object-cover"
      />
      <div aria-hidden className="bg-hero-veil/25 absolute inset-0 -z-20" />
      <div
        aria-hidden
        className="from-app/55 absolute inset-0 -z-20 bg-linear-to-t via-app/20 to-app/40 dark:from-ink/85 dark:via-transparent dark:to-ink/60"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-25 mix-blend-multiply dark:opacity-40 dark:mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 90% 70% at 12% -10%, var(--accent) 0%, transparent 55%), radial-gradient(ellipse 80% 65% at 100% 5%, var(--primary) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-7 text-center">
        <div
          aria-hidden
          className="bg-app/35 absolute top-1/2 left-1/2 -z-10 h-[140%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl dark:bg-ink/45"
        />
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-ink glass-surface backdrop-blur-sm relative rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.14em] uppercase dark:text-foam"
        >
          {t("eyebrow")}
        </motion.span>

        <motion.h1
          variants={headline}
          initial="hidden"
          animate="visible"
          className="font-heading text-ink relative text-5xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-7xl dark:text-foam"
        >
          <motion.span variants={word} className="block">
            {t("titleLine1")}
          </motion.span>
          <motion.span
            variants={word}
            className="from-ink via-teal to-moss dark:from-accent dark:via-foam dark:to-accent block bg-linear-to-r bg-clip-text text-transparent"
          >
            {t("titleLine2")}
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-ink relative max-w-2xl text-lg leading-relaxed font-medium text-pretty sm:text-xl dark:text-foam/80"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="relative"
        >
          <Button href="#search" variant="solid" size="lg">
            {t("cta")}
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="text-ink/70 relative mt-16 hidden flex-col items-center gap-2 text-xs font-medium tracking-wide uppercase sm:flex dark:text-foam/70"
      >
        <span>{t("scrollHint")}</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-4" aria-hidden />
        </motion.span>
      </motion.div>
    </section>
  );
}
