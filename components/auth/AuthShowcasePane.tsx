"use client";

import { motion } from "framer-motion";
import { QrCode, ShieldCheck, Wallet, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/logo/Logo";
import { fadeUp } from "@/lib/motion/variants";

export type AuthMode = "login" | "register" | "verify" | "forgot" | "reset";

type AuthShowcasePaneProps = {
  mode: AuthMode;
};

const IMAGE_SRC: Record<AuthMode, string> = {
  login: "/images/landing/site-umayyad-mosque.png",
  register: "/images/landing/site-aleppo-citadel.png",
  verify: "/images/landing/site-umayyad-mosque.png",
  forgot: "/images/landing/site-aleppo-citadel.png",
  reset: "/images/landing/site-umayyad-mosque.png",
};

const QUOTE_KEY: Record<
  AuthMode,
  | "imageQuoteLogin"
  | "imageQuoteRegister"
  | "imageQuoteVerify"
  | "imageQuoteForgot"
  | "imageQuoteReset"
> = {
  login: "imageQuoteLogin",
  register: "imageQuoteRegister",
  verify: "imageQuoteVerify",
  forgot: "imageQuoteForgot",
  reset: "imageQuoteReset",
};

const TRUST_ITEMS: {
  key: "cashOnArrivalTitle" | "offlineQrTitle" | "licensedProvidersTitle";
  icon: LucideIcon;
}[] = [
  { key: "cashOnArrivalTitle", icon: Wallet },
  { key: "offlineQrTitle", icon: QrCode },
  { key: "licensedProvidersTitle", icon: ShieldCheck },
];

export function AuthShowcasePane({ mode }: AuthShowcasePaneProps): ReactNode {
  const t = useTranslations("auth");
  const tHero = useTranslations("landing.hero");
  const tTrust = useTranslations("landing.trustBar");

  return (
    <div className="relative hidden h-full w-[42%] shrink-0 overflow-hidden lg:block">
      <Image
        src={IMAGE_SRC[mode]}
        alt=""
        fill
        priority
        sizes="42vw"
        className="absolute inset-0 object-cover"
      />
      <div aria-hidden className="bg-hero-veil/50 absolute inset-0" />
      <div
        aria-hidden
        className="from-app/90 absolute inset-0 bg-linear-to-t via-transparent to-app/55 dark:from-ink/85 dark:via-transparent dark:to-ink/60"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-25 mix-blend-multiply dark:opacity-40 dark:mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 90% 70% at 12% -10%, var(--accent) 0%, transparent 55%), radial-gradient(ellipse 80% 65% at 100% 5%, var(--primary) 0%, transparent 60%)",
        }}
      />

      <div className="relative flex h-full flex-col justify-between p-10">
        <Link href="/" className="flex w-fit items-center">
          <Logo variant="main" className="h-10" />
        </Link>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col gap-6"
        >
          <span className="text-prose text-xs font-semibold tracking-[0.14em] uppercase dark:text-foam/85">
            {tHero("eyebrow")}
          </span>
          <p className="font-heading text-prose text-2xl leading-snug font-semibold text-balance dark:text-foam">
            {t(QUOTE_KEY[mode])}
          </p>
          <div className="flex flex-col gap-3">
            {TRUST_ITEMS.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="text-prose-muted flex items-center gap-2.5 text-sm font-medium dark:text-foam/85"
              >
                <span className="glass-surface backdrop-blur-sm flex size-8 shrink-0 items-center justify-center rounded-full">
                  <Icon className="size-4" aria-hidden />
                </span>
                {tTrust(key)}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
