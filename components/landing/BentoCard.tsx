"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import type { BentoPillar, BentoTileSize, LandingPillarId } from "@/lib/mock/landing";

const SIZE_CLASSES: Record<BentoTileSize, string> = {
  large: "lg:col-span-2 lg:row-span-2",
  medium: "lg:col-span-2 lg:row-span-1",
};

type PillarTitleKey =
  | "hotelsTitle"
  | "diningTitle"
  | "tripsTitle"
  | "eventsTitle"
  | "guidesTitle";

type PillarBodyKey = "hotelsBody" | "diningBody" | "tripsBody" | "eventsBody" | "guidesBody";

const TITLE_KEY: Record<LandingPillarId, PillarTitleKey> = {
  hotels: "hotelsTitle",
  dining: "diningTitle",
  trips: "tripsTitle",
  events: "eventsTitle",
  guides: "guidesTitle",
};

const BODY_KEY: Record<LandingPillarId, PillarBodyKey> = {
  hotels: "hotelsBody",
  dining: "diningBody",
  trips: "tripsBody",
  events: "eventsBody",
  guides: "guidesBody",
};

const TILT_RANGE_DEG = 9;

type BentoCardProps = {
  pillar: BentoPillar;
};

export function BentoCard({ pillar }: BentoCardProps): ReactNode {
  const t = useTranslations("landing.pillars");
  const tTags = useTranslations("landing.pillars.tags");

  const rotateX = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 });

  function onMouseMove(event: MouseEvent<HTMLDivElement>): void {
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(relativeX * TILT_RANGE_DEG);
    rotateX.set(relativeY * -TILT_RANGE_DEG);
  }

  function onMouseLeave(): void {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(
        "group border-glass-border rounded-glass relative flex flex-col justify-end overflow-hidden border p-7",
        SIZE_CLASSES[pillar.size],
      )}
    >
      <Image
        src={pillar.imageSrc}
        alt=""
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="absolute inset-0 -z-20 object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div
        aria-hidden
        className="from-ink/92 absolute inset-0 -z-10 bg-linear-to-t via-ink/60 to-ink/40"
      />

      <h3 className="font-heading text-foam relative text-xl font-semibold tracking-tight sm:text-2xl">
        {t(TITLE_KEY[pillar.id])}
      </h3>
      <p className="text-foam/85 relative mt-2.5 max-w-sm text-sm leading-relaxed">
        {t(BODY_KEY[pillar.id])}
      </p>

      <div className="relative mt-4 flex flex-wrap gap-2">
        {pillar.tagKeys.map((tagKey) => (
          <Badge key={tagKey} variant="glass" className="text-foam">
            {tTags(tagKey)}
          </Badge>
        ))}
      </div>

      <Link
        href={pillar.href}
        className="text-foam relative mt-5 inline-flex w-fit items-center gap-1 text-sm font-semibold"
      >
        {t("explore")}
        <ArrowUpRight
          className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5"
          aria-hidden
        />
      </Link>
    </motion.div>
  );
}
