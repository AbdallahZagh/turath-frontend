"use client";

import { Check } from "lucide-react";
import { useLocale } from "next-intl";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatCount } from "@/lib/format/number";

export type ProviderRegisterProgressStep = {
  id: string;
  label: string;
};

type ProviderRegisterProgressProps = {
  steps: readonly ProviderRegisterProgressStep[];
  current: number;
  label: string;
  onSelect: (index: number) => void;
};

export function ProviderRegisterProgress({
  steps,
  current,
  label,
  onSelect,
}: ProviderRegisterProgressProps): ReactNode {
  const locale = useLocale();
  return (
    <nav aria-label={label} className="mt-5">
      <ol className="grid grid-cols-4 gap-2">
        {steps.map((step, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li key={step.id}>
              <button
                type="button"
                disabled={index > current}
                onClick={() => onSelect(index)}
                className={cn(
                  "flex w-full flex-col items-center gap-1.5 rounded-xl py-1",
                  index > current && "opacity-45",
                )}
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full text-xs font-semibold",
                    done || active
                      ? "bg-primary text-primary-foreground"
                      : "bg-app-muted text-prose-muted",
                  )}
                >
                  {done ? (
                    <Check className="size-3.5" aria-hidden />
                  ) : (
                    formatCount(index + 1, locale)
                  )}
                </span>
                <span
                  className={cn(
                    "w-full truncate text-center text-[0.7rem] font-medium sm:text-xs",
                    active ? "text-prose" : "text-prose-muted",
                  )}
                >
                  {step.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
