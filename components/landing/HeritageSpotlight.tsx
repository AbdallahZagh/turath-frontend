"use client";

import { motion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";

import { fadeUp, viewportOnce } from "@/lib/motion/variants";
import { HERITAGE_SITES } from "@/lib/mock/landing";

import { SectionHeading } from "./SectionHeading";

export function HeritageSpotlight(): ReactNode {
  const t = useTranslations("landing.spotlight");
  const tSites = useTranslations("landing.spotlight.sites");
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      className="py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} align="start" className="max-w-xl" />
          <span className="text-prose-muted hidden shrink-0 items-center gap-2 text-xs font-medium tracking-wide uppercase sm:flex">
            <MoveHorizontal className="size-4" aria-hidden />
            {t("dragHint")}
          </span>
        </div>
      </div>

      <div ref={constraintsRef} className="mt-10 overflow-hidden px-4 sm:px-6">
        <motion.div
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.08}
          className="mx-auto flex max-w-7xl cursor-grab gap-5 active:cursor-grabbing"
        >
          {HERITAGE_SITES.map((site) => (
            <div
              key={site.slug}
              className="rounded-glass border-glass-border relative flex h-88 w-76 shrink-0 flex-col justify-end overflow-hidden border p-6 select-none"
            >
              <Image
                src={site.imageSrc}
                alt=""
                fill
                sizes="304px"
                className="absolute inset-0 -z-20 object-cover"
              />
              <div
                aria-hidden
                className="from-ink/92 absolute inset-0 -z-10 bg-linear-to-t via-ink/60 to-ink/40"
              />
              <h3 className="font-heading text-foam relative text-xl font-semibold tracking-tight">
                {tSites(`${site.translationKey}.title`)}
              </h3>
              <p className="text-foam/70 relative text-xs font-semibold tracking-wide uppercase">
                {tSites(`${site.translationKey}.meta`)}
              </p>
              <p className="text-foam/85 relative mt-2.5 text-sm leading-relaxed">
                {tSites(`${site.translationKey}.blurb`)}
              </p>
              <Link
                href={`/attractions/${site.slug}`}
                className="text-foam relative mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold"
              >
                {t("cta")}
              </Link>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
