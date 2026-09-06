"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useLiveFeaturedSlot } from "@/hooks/useHomeFeatured";
import type { Locale } from "@/i18n/config";
import { localizedName } from "@/lib/i18n/localized";
import { fadeUp, viewportOnce } from "@/lib/motion/variants";

export function HomeCampaign(): ReactNode {
  const t = useTranslations("landing.campaign");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const { data } = useLiveFeaturedSlot("home_campaign");
  const campaign = data?.[0];

  if (!campaign) {
    return null;
  }

  return (
    <section className="scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        className="mx-auto max-w-5xl"
      >
        <GlassPanel className="relative overflow-hidden p-8 sm:p-10">
          <div
            aria-hidden
            className="from-primary/25 via-accent/10 pointer-events-none absolute inset-0 bg-linear-to-br to-transparent"
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="glass" className="gap-1.5">
                  <Sparkles className="size-3.5" aria-hidden />
                  {t("featuredBadge")}
                </Badge>
                <p className="text-accent text-xs font-semibold tracking-[0.14em] uppercase">
                  {t("eyebrow")}
                </p>
              </div>
              <h2 className="font-heading text-prose mt-4 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                {localizedName(campaign.title, loc)}
              </h2>
              <p className="text-prose-muted mt-2 text-sm leading-relaxed sm:text-base">
                {localizedName(campaign.target, loc)}
              </p>
            </div>
            <Link
              href="/attractions"
              className="text-prose relative inline-flex w-fit items-center gap-1 text-sm font-semibold"
            >
              {t("cta")}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </GlassPanel>
      </motion.div>
    </section>
  );
}
