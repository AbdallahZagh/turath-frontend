"use client";

import { motion } from "framer-motion";
import { Coins, Menu as MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { Logo } from "@/components/logo/Logo";
import { Button } from "@/components/ui/Button";
import {
  SELECT_MENU_BASE,
  SELECT_MENU_VARIANT,
  SELECT_OPTION,
} from "@/components/ui/controlClasses";
import { controlStyle } from "@/components/ui/controlScale";
import { placeAnchoredMenu } from "@/components/ui/placeMenu";
import { Select, type SelectOption } from "@/components/ui/Select";
import { useIsClient } from "@/hooks/useIsClient";
import { cn } from "@/lib/cn";
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
  { href: "/#how-it-works", labelKey: "navHowItWorks" },
];

const NAV_LINK_CLASS =
  "text-prose-muted hover:text-prose relative px-3 py-2 text-sm font-medium transition-colors";

const MOBILE_MENU_MIN_WIDTH_PX = 220;

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

        if (item.href.includes("#")) {
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

type HeaderMobileNavProps = {
  currencyOptions: SelectOption[];
  currency: string;
  onCurrencyChange: (value: string) => void;
};

function HeaderMobileNav({
  currencyOptions,
  currency,
  onCurrencyChange,
}: HeaderMobileNavProps): ReactNode {
  const t = useTranslations("landing.header");
  const mounted = useIsClient();
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState<CSSProperties | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function sync(): void {
      const trigger = triggerRef.current;
      if (!trigger) {
        return;
      }
      setBox(
        placeAnchoredMenu(trigger, {
          estimatedHeight: 12 + NAV_ITEMS.length * 40 + 120,
          maxHeightCap: 420,
          width: "max-content",
          minWidth: Math.max(trigger.getBoundingClientRect().width, MOBILE_MENU_MIN_WIDTH_PX),
          align: "end",
        }),
      );
    }

    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("scroll", sync, true);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", sync, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: PointerEvent): void {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    }

    function onKeyDown(event: globalThis.KeyboardEvent): void {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (event.key === "ArrowDown" && !open) {
      event.preventDefault();
      setOpen(true);
    }
  }

  const panel =
    mounted && open && box
      ? createPortal(
          <div
            ref={panelRef}
            id={menuId}
            role="menu"
            aria-label={t("navLabel")}
            style={{ ...controlStyle({ size: "sm", defaultRadius: "0.5rem" }), ...box }}
            className={cn(SELECT_MENU_BASE, SELECT_MENU_VARIANT.glass, "w-max max-w-[min(100vw-2rem,20rem)]")}
          >
            {NAV_ITEMS.map((item) => {
              const label = t(item.labelKey);
              const className = cn(SELECT_OPTION, "min-h-11 w-full no-underline");
              const onNavigate = () => setOpen(false);

              if (item.href.includes("#")) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    className={className}
                    onClick={onNavigate}
                  >
                    {label}
                  </a>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  className={className}
                  onClick={onNavigate}
                >
                  {label}
                </Link>
              );
            })}

            <div
              role="none"
              className="border-glass-border mt-1 flex flex-col gap-3 border-t px-3 py-3 sm:hidden"
            >
              <p className="text-prose-muted text-[0.65rem] font-semibold tracking-wide uppercase">
                {t("appearanceMenu")}
              </p>
              <ThemeToggle />
            </div>

            <div
              role="none"
              className="border-glass-border mt-1 flex flex-col gap-2 border-t px-3 py-3 md:hidden"
            >
              <p className="text-prose-muted text-[0.65rem] font-semibold tracking-wide uppercase">
                {t("currencyLabel")}
              </p>
              <Select
                compact
                size="sm"
                paddingX="0.7em"
                variant="plain"
                className="w-full"
                icon={<Coins className="size-3.5" />}
                options={currencyOptions}
                value={currency}
                onChange={(value) => {
                  onCurrencyChange(value);
                }}
                label={t("currencyLabel")}
              />
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="relative shrink-0 lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label={t("openMenu")}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        className="text-prose-muted hover:bg-option-hover hover:text-prose flex size-11 items-center justify-center rounded-full transition-colors"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onTriggerKeyDown}
      >
        <MenuIcon className="size-4" aria-hidden />
      </button>
      {panel}
    </div>
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

  function onCurrencyChange(value: string): void {
    if (isCurrency(value)) {
      setCurrency(value);
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-4 z-50 overflow-x-clip px-3 sm:px-6"
    >
      <div className="glass-surface glass-frost backdrop-blur-md rounded-glass mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-5 sm:py-2.5">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 p-1.5 sm:p-2">
          <Logo variant="main" className="h-9 sm:h-9" priority />
        </Link>

        <HeaderNav />

        <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-3">
          <HeaderMobileNav
            currencyOptions={currencyOptions}
            currency={currency}
            onCurrencyChange={onCurrencyChange}
          />
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
            onChange={onCurrencyChange}
            label={t("currencyLabel")}
          />
          <LocaleSwitcher compact />
          <Button variant="outline" size="sm" href="/login" className="shrink-0">
            {t("login")}
          </Button>
          <Button variant="solid" size="sm" href="/register" className="shrink-0">
            {t("register")}
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
