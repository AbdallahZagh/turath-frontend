"use client";

import { hasFlag } from "country-flag-icons";
import * as FlagIcons from "country-flag-icons/react/3x2";
import type { ComponentType, ReactNode } from "react";

import { cn } from "@/lib/cn";

type FlagSvg = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean;
}>;

const FLAGS = FlagIcons as Record<string, FlagSvg | undefined>;

type CountryFlagProps = {
  iso2: string;
  className?: string;
};

export function CountryFlag({ iso2, className }: CountryFlagProps): ReactNode {
  const code = iso2.toUpperCase();
  if (!hasFlag(code)) {
    return null;
  }
  const Flag = FLAGS[code];
  if (!Flag) {
    return null;
  }
  return (
    <Flag
      aria-hidden
      className={cn("block h-4 w-6 shrink-0 rounded-[1px]", className)}
    />
  );
}
