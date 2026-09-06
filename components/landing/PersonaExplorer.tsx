"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";
import { useLiveFeaturedSlot } from "@/hooks/useHomeFeatured";
import { cn } from "@/lib/cn";
import type { Locale } from "@/i18n/config";
import { localizedName } from "@/lib/i18n/localized";
import { PERSONA_IDS, PERSONA_INTEREST_TILES, type PersonaId } from "@/lib/mock/landing";

import { SectionHeading } from "./SectionHeading";

const FEATURED_GRADIENTS = [
  "from-primary/75 via-accent/35 to-transparent",
  "from-accent/70 via-primary/40 to-transparent",
  "from-primary/65 via-accent/30 to-transparent",
  "from-accent/65 via-primary/35 to-transparent",
] as const;

export function PersonaExplorer(): ReactNode {
  const t = useTranslations("landing.personas");
  const tTiles = useTranslations("landing.personas.tiles");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const [active, setActive] = useState<PersonaId>("firstTime");
  const { data: liveFeatured } = useLiveFeaturedSlot("persona_rail");

  const featuredTiles = useMemo(() => {
    if (!liveFeatured || liveFeatured.length === 0) {
      return null;
    }
    return liveFeatured.slice(0, 4).map((row, index) => ({
      id: row.id,
      label: localizedName(row.target, loc),
      href: "/explore",
      gradient: FEATURED_GRADIENTS[index % FEATURED_GRADIENTS.length],
    }));
  }, [liveFeatured, loc]);

  const tiles = PERSONA_INTEREST_TILES[active];

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

        {featuredTiles ? (
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featuredTiles.map((tile) => (
              <Link
                key={tile.id}
                href={tile.href}
                className="group rounded-glass relative flex h-48 flex-col justify-end overflow-hidden p-4 sm:h-56 sm:p-5"
              >
                <div
                  aria-hidden
                  className={cn(
                    "absolute inset-0 bg-linear-to-t transition-transform duration-500 group-hover:scale-105",
                    tile.gradient,
                  )}
                />
                <div
                  aria-hidden
                  className="from-ink/75 absolute inset-0 bg-linear-to-t via-transparent to-transparent"
                />
                <Badge variant="glass" className="text-foam absolute top-3 start-3 z-10">
                  {t("featuredBadge")}
                </Badge>
                <span className="text-foam relative flex items-center gap-1.5 text-sm font-semibold text-balance">
                  {tile.label}
                  <ArrowUpRight
                    className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <>
            <div
              role="tablist"
              aria-label={t("title")}
              className="glass-surface backdrop-blur-sm mx-auto mt-8 flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-full p-1"
            >
              {PERSONA_IDS.map((persona) => {
                const isActive = persona === active;

                return (
                  <button
                    key={persona}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(persona)}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                      isActive
                        ? "text-primary-foreground"
                        : "text-prose-muted hover:text-prose",
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="activePersonaTab"
                        className="bg-primary absolute inset-0 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    <span className="relative">{t(persona)}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
              >
                {tiles.map((tile) => (
                  <Link
                    key={tile.key}
                    href={tile.href}
                    className="group rounded-glass relative flex h-48 flex-col justify-end overflow-hidden p-4 sm:h-56 sm:p-5"
                  >
                    <div
                      aria-hidden
                      className={cn(
                        "absolute inset-0 bg-linear-to-t transition-transform duration-500 group-hover:scale-105",
                        tile.gradient,
                      )}
                    />
                    <div
                      aria-hidden
                      className="from-ink/75 absolute inset-0 bg-linear-to-t via-transparent to-transparent"
                    />
                    <span className="text-foam relative flex items-center gap-1.5 text-sm font-semibold text-balance">
                      {tTiles(tile.key)}
                      <ArrowUpRight
                        className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </Link>
                ))}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  );
}
