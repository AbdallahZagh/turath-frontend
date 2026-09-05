"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef, type ReactNode } from "react";

import { HOW_IT_WORKS_STEPS, type HowItWorksStepId } from "@/lib/mock/landing";

import { SectionHeading } from "./SectionHeading";

type StepTitleKey = "reserveTitle" | "qrPassTitle" | "checkInTitle";
type StepBodyKey = "reserveBody" | "qrPassBody" | "checkInBody";

const TITLE_KEY: Record<HowItWorksStepId, StepTitleKey> = {
  reserve: "reserveTitle",
  qrPass: "qrPassTitle",
  checkIn: "checkInTitle",
};

const BODY_KEY: Record<HowItWorksStepId, StepBodyKey> = {
  reserve: "reserveBody",
  qrPass: "qrPassBody",
  checkIn: "checkInBody",
};

export function HowItWorks(): ReactNode {
  const t = useTranslations("landing.howItWorks");
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.4"],
  });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="how-it-works" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

      <div ref={containerRef} className="relative mx-auto mt-16 max-w-5xl">
        <div
          aria-hidden
          className="border-border absolute inset-x-0 top-6 hidden h-0.5 border-t border-dashed sm:block"
        />
        <motion.div
          aria-hidden
          style={{ width: progressWidth }}
          className="bg-accent absolute start-0 top-6 hidden h-0.5 sm:block"
        />

        <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center gap-4 text-center"
              >
                <span className="bg-primary text-primary-foreground relative z-10 flex size-12 items-center justify-center rounded-full">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="font-heading text-prose text-lg font-semibold">
                  {t(TITLE_KEY[step.id])}
                </h3>
                <p className="text-prose-muted max-w-xs text-sm leading-relaxed">
                  {t(BODY_KEY[step.id])}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
