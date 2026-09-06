"use client";

import { motion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, type ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";
import { useLiveFeaturedSlot } from "@/hooks/useHomeFeatured";
import type { Locale } from "@/i18n/config";
import { localizedName } from "@/lib/i18n/localized";
import { HERITAGE_SITES } from "@/lib/mock/landing";
import { fadeUp, viewportOnce } from "@/lib/motion/variants";

import { SectionHeading } from "./SectionHeading";

const FEATURED_GRADIENTS = [
  "from-primary/70 via-accent/35 to-transparent",
  "from-accent/70 via-primary/35 to-transparent",
  "from-primary/60 via-accent/45 to-transparent",
  "from-accent/60 via-primary/40 to-transparent",
  "from-primary/65 via-accent/30 to-transparent",
  "from-accent/65 via-primary/35 to-transparent",
] as const;

export function HeritageSpotlight(): ReactNode {
  const t = useTranslations("landing.spotlight");
  const tSites = useTranslations("landing.spotlight.sites");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const constraintsRef = useRef<HTMLDivElement>(null);
  const { data: liveFeatured } = useLiveFeaturedSlot("heritage_spotlight");

  const featuredCards = useMemo(() => {
    if (!liveFeatured || liveFeatured.length === 0) {
      return null;
    }
    return liveFeatured.slice(0, 6).map((row, index) => ({
      id: row.id,
      title: localizedName(row.target, loc),
      blurb: localizedName(row.title, loc),
      gradient: FEATURED_GRADIENTS[index % FEATURED_GRADIENTS.length],
      href: "/attractions",
    }));
  }, [liveFeatured, loc]);

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
          {featuredCards
            ? featuredCards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-glass border-glass-border relative flex h-88 w-76 shrink-0 flex-col justify-end overflow-hidden border p-6 select-none"
                >
                  <div
                    aria-hidden
                    className={`absolute inset-0 -z-20 bg-linear-to-br ${card.gradient}`}
                  />
                  <div
                    aria-hidden
                    className="from-ink/92 absolute inset-0 -z-10 bg-linear-to-t via-ink/60 to-ink/40"
                  />
                  <Badge variant="glass" className="text-foam absolute top-4 start-4 z-10">
                    {t("featuredBadge")}
                  </Badge>
                  <h3 className="font-heading text-foam relative text-xl font-semibold tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-foam/85 relative mt-2.5 text-sm leading-relaxed">
                    {card.blurb}
                  </p>
                  <Link
                    href={card.href}
                    className="text-foam relative mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold"
                  >
                    {t("cta")}
                  </Link>
                </div>
              ))
            : HERITAGE_SITES.map((site) => (
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
