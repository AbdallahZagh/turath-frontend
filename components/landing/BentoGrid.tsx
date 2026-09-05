"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { staggerContainer, viewportOnce } from "@/lib/motion/variants";
import { BENTO_PILLARS } from "@/lib/mock/landing";

import { BentoCard } from "./BentoCard";
import { SectionHeading } from "./SectionHeading";

export function BentoGrid(): ReactNode {
  const t = useTranslations("landing.pillars");

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3"
        >
          {BENTO_PILLARS.map((pillar) => (
            <BentoCard key={pillar.id} pillar={pillar} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
