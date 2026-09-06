"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/cn";
import { fadeUp, viewportOnce } from "@/lib/motion/variants";
import { GOVERNORATES, HERITAGE_SITES, type GovernorateSlug } from "@/lib/mock/landing";

import { SectionHeading } from "./SectionHeading";

export function MapExplorerPreview(): ReactNode {
  const t = useTranslations("landing.mapExplorer");
  const tGov = useTranslations("landing.governorates");
  const tSites = useTranslations("landing.spotlight.sites");
  const [active, setActive] = useState<GovernorateSlug>("damascus");

  const activeGovernorate =
    GOVERNORATES.find((governorate) => governorate.slug === active) ?? GOVERNORATES[0];
  const nearbySites = HERITAGE_SITES.filter((site) => site.governorateSlug === active);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      className="px-4 py-20 sm:px-6 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {GOVERNORATES.map((governorate) => {
            const isActive = governorate.slug === active;
            return (
              <button
                key={governorate.slug}
                type="button"
                onClick={() => setActive(governorate.slug)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "glass-surface backdrop-blur-sm text-prose-muted hover:text-prose",
                )}
              >
                {tGov(governorate.slug)}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <GlassPanel className="border-glass-border relative h-90 overflow-hidden border p-0 sm:h-105">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: 1.15,
                x: `${50 - activeGovernorate.positionPercent.x}%`,
                y: `${50 - activeGovernorate.positionPercent.y}%`,
              }}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
            >
              {GOVERNORATES.map((governorate) => {
                const isActive = governorate.slug === active;
                return (
                  <motion.button
                    key={governorate.slug}
                    type="button"
                    onClick={() => setActive(governorate.slug)}
                    animate={{ scale: isActive ? 1.25 : 1 }}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${governorate.positionPercent.x}%`,
                      top: `${governorate.positionPercent.y}%`,
                    }}
                  >
                    <span
                      className={cn(
                        "border-glass-border absolute left-1/2 top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border",
                        isActive
                          ? "bg-accent/20 shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_18%,transparent)]"
                          : "bg-primary/10",
                      )}
                      aria-hidden
                    />
                    <MapPin
                      className={cn(
                        "relative size-6 drop-shadow-sm",
                        isActive ? "text-accent" : "text-primary/70",
                      )}
                      fill={isActive ? "var(--accent)" : "color-mix(in srgb, var(--primary) 35%, transparent)"}
                      aria-hidden
                    />
                    <span className="sr-only">{tGov(governorate.slug)}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          </GlassPanel>

          <GlassPanel className="flex flex-col gap-4 p-6">
            <h3 className="font-heading text-prose text-lg font-semibold">
              {t("attractionsNearby")}
            </h3>
            <div className="flex flex-1 flex-col gap-3">
              {nearbySites.map((site) => (
                <div key={site.slug} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "size-10 shrink-0 rounded-full bg-linear-to-br",
                      site.gradient,
                    )}
                    aria-hidden
                  />
                  <div>
                    <p className="text-prose text-sm font-semibold">
                      {tSites(`${site.translationKey}.title`)}
                    </p>
                    <p className="text-prose-muted text-xs">
                      {tSites(`${site.translationKey}.meta`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button href="/explore" variant="outline" className="w-full justify-center">
              {t("cta")}
            </Button>
          </GlassPanel>
        </div>
      </div>
    </motion.section>
  );
}
