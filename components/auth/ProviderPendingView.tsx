"use client";

import { motion } from "framer-motion";
import { Clock3 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/logo/Logo";
import { Button } from "@/components/ui/Button";
import { fadeUp } from "@/lib/motion/variants";

export function ProviderPendingView(): ReactNode {
  const t = useTranslations("providerPending");

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="w-full max-w-xl rounded-glass p-8 sm:p-5"
    >
      <Logo variant="main" className="h-9 w-fit [&_img]:h-full [&_img]:w-auto lg:hidden" />
      <div className="bg-app-muted text-primary mt-6 flex size-12 items-center justify-center rounded-full">
        <Clock3 className="size-6" aria-hidden />
      </div>
      <h1 className="font-heading text-prose mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
        {t("title")}
      </h1>
      <p className="text-prose-muted mt-2 text-sm leading-relaxed">{t("lead")}</p>
      <ul className="text-prose-muted mt-5 flex flex-col gap-2.5 text-sm leading-relaxed">
        <li>{t("stepReview")}</li>
        <li>{t("stepDocs")}</li>
        <li>{t("stepNotify")}</li>
      </ul>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button href="/" variant="solid" className="justify-center sm:flex-1">
          {t("backHome")}
        </Button>
        <Link
          href="/login"
          className="text-prose-muted hover:text-prose inline-flex items-center justify-center text-sm font-medium transition-colors sm:flex-1"
        >
          {t("toLogin")}
        </Link>
      </div>
    </motion.div>
  );
}
