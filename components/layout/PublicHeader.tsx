"use client";

import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import { Logo } from "@/components/logo/Logo";
import { Button } from "@/components/ui/Button";
import { Select, type SelectOption } from "@/components/ui/Select";
import { isCurrency, useCurrencyStore } from "@/store/currencyStore";

import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";

type NavItem = {
  href: string;
  labelKey: "navHotels" | "navDining" | "navTrips" | "navEvents" | "navGuides" | "navHowItWorks";
};

const NAV_ITEMS: NavItem[] = [
  { href: "/hotels", labelKey: "navHotels" },
  { href: "/restaurants", labelKey: "navDining" },
  { href: "/trips", labelKey: "navTrips" },
  { href: "/events", labelKey: "navEvents" },
  { href: "/guides", labelKey: "navGuides" },
  { href: "#how-it-works", labelKey: "navHowItWorks" },
];

const NAV_LINK_CLASS =
  "text-prose-muted hover:text-prose relative px-3 py-2 text-sm font-medium transition-colors";

function HeaderNav(): ReactNode {
  const t = useTranslations("landing.header");
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label={t("navLabel")}>
      {NAV_ITEMS.map((item) => {
        const label = t(item.labelKey);
        const underline =
          hovered === item.href ? (
            <motion.span
              layoutId="header-nav-underline"
              className="bg-accent absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full"
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            />
          ) : null;
        const hoverProps = {
          onMouseEnter: () => setHovered(item.href),
          onMouseLeave: () => setHovered(null),
        };

        if (item.href.startsWith("#")) {
          return (
            <a key={item.href} href={item.href} className={NAV_LINK_CLASS} {...hoverProps}>
              {label}
              {underline}
            </a>
          );
        }

        return (
          <Link key={item.href} href={item.href} className={NAV_LINK_CLASS} {...hoverProps}>
            {label}
            {underline}
          </Link>
        );
      })}
    </nav>
  );
}

export function PublicHeader(): ReactNode {
  const t = useTranslations("landing.header");
  const currency = useCurrencyStore((state) => state.currency);
  const setCurrency = useCurrencyStore((state) => state.setCurrency);

  const currencyOptions: SelectOption[] = [
    { value: "SYP", label: t("currencySyp") },
    { value: "USD", label: t("currencyUsd") },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-4 z-50 px-4 sm:px-6"
    >
      <div className="glass-surface backdrop-blur-sm rounded-glass mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-5 sm:py-2.5">
        <Link href="/" className="flex shrink-0 items-center gap-2 p-2">
          <Logo variant="main" className="h-11 sm:h-9" priority />
        </Link>

        <HeaderNav />

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <Select
            compact
            className="hidden md:block"
            size="sm"
            paddingX="0.7em"
            variant="plain"
            icon={<Coins className="size-3.5" />}
            options={currencyOptions}
            value={currency}
            onChange={(value) => {
              if (isCurrency(value)) {
                setCurrency(value);
              }
            }}
            label={t("currencyLabel")}
          />
          <LocaleSwitcher compact />
          <Button variant="outline" size="sm" href="/login">
            {t("login")}
          </Button>
          <Button variant="solid" size="sm" href="/register">
            {t("register")}
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
