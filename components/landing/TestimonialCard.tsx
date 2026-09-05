"use client";

import { motion } from "framer-motion";
import { Quote, ShieldCheck, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { fadeUp } from "@/lib/motion/variants";
import type { Testimonial } from "@/lib/mock/landing";

const STAR_COUNT = 5;

type TestimonialCardProps = {
  testimonial: Testimonial;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps): ReactNode {
  const t = useTranslations("landing.testimonials");
  const tItem = useTranslations("landing.testimonials.items");
  const itemKey = testimonial.translationKey;

  return (
    <motion.article variants={fadeUp} className="h-full">
      <GlassPanel className="flex h-full min-h-88 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <Quote className="text-accent size-8 shrink-0" aria-hidden />
          <div
            className="flex items-center gap-0.5"
            aria-label={t("ratingLabel", { count: testimonial.rating })}
          >
            {Array.from({ length: STAR_COUNT }).map((_, index) => {
              const filled = index < testimonial.rating;
              return (
                <Star
                  key={index}
                  className={
                    filled
                      ? "fill-accent text-accent size-3.5"
                      : "text-border size-3.5"
                  }
                  aria-hidden
                />
              );
            })}
          </div>
        </div>

        <p className="font-heading text-prose mt-5 line-clamp-5 flex-1 text-lg leading-snug text-pretty">
          &ldquo;{tItem(`${itemKey}.quote`)}&rdquo;
        </p>

        <div className="border-glass-border mt-6 flex items-center gap-3 border-t pt-5">
          <span className="bg-primary text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
            {testimonial.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-prose truncate text-sm font-semibold">
              {tItem(`${itemKey}.name`)}
            </p>
            <p className="text-prose-muted truncate text-xs">
              {tItem(`${itemKey}.meta`)}
            </p>
            <p className="text-accent mt-1 flex items-center gap-1 text-xs font-medium">
              <ShieldCheck className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">{t("verifiedBadge")}</span>
            </p>
          </div>
        </div>
      </GlassPanel>
    </motion.article>
  );
}
