"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import type { ComponentType, ReactNode } from "react";

import { Tooltip } from "@/components/ui/Tooltip";
import { useIsClient } from "@/hooks/useIsClient";
import { cn } from "@/lib/cn";

const THEMES = ["light", "dark", "system"] as const;

type ThemeValue = (typeof THEMES)[number];

const THEME_ICONS: Record<ThemeValue, ComponentType<{ className?: string }>> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps): ReactNode {
  const t = useTranslations("chrome");
  const { theme, setTheme } = useTheme();
  const mounted = useIsClient();
  const value: ThemeValue =
    mounted && (theme === "light" || theme === "dark" || theme === "system")
      ? theme
      : "system";

  return (
    <div
      role="radiogroup"
      aria-label={t("theme")}
      className={cn(
        "border-accent/10 bg-glass backdrop-blur-sm flex w-fit items-center gap-0.5 rounded-[0.7rem] border p-1",
        className,
      )}
    >
      {THEMES.map((option) => {
        const Icon = THEME_ICONS[option];
        const isActive = value === option;

        return (
          <Tooltip key={option} content={t(option)} placement="bottom" className="flex-1">
            <button
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={t(option)}
              onClick={() => setTheme(option)}
              className={cn(
                "flex h-8 w-full min-w-8 items-center justify-center rounded-lg transition-colors duration-200",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-prose-muted hover:text-prose",
              )}
            >
              <Icon className="size-4" aria-hidden />
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}
