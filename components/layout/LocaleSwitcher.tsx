"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition, type ReactNode } from "react";

import { Select, type SelectOption } from "@/components/ui/Select";
import { type Locale } from "@/i18n/config";
import { setLocaleCookie } from "@/i18n/set-locale";
import { cn } from "@/lib/cn";

type LocaleSwitcherProps = {
  compact?: boolean;
  className?: string;
};

export function LocaleSwitcher({
  compact = false,
  className,
}: LocaleSwitcherProps): ReactNode {
  const t = useTranslations("chrome");
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const current: Locale = locale === "ar" ? "ar" : "en";

  function onSelect(next: string): void {
    const nextLocale: Locale = next === "ar" ? "ar" : "en";
    startTransition(async () => {
      await setLocaleCookie(nextLocale);
      router.refresh();
    });
  }

  const options: SelectOption[] = [
    {
      value: "en",
      label: compact ? t("localeEnShort") : t("localeEn"),
    },
    {
      value: "ar",
      label: compact ? t("localeArShort") : t("localeAr"),
    },
  ];

  return (
    <Select
      variant="plain"
      size="sm"
      icon={<Globe className="size-3.5" />}
      options={options}
      value={current}
      onChange={onSelect}
      disabled={pending}
      label={t("language")}
      paddingX={compact ? "0.7em" : undefined}
      className={cn(!compact && "w-36", className)}
      compact={compact}
    />
  );
}
