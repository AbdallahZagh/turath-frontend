import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatSypParts, type DisplayCurrency } from "@/lib/format/money";

type StackedMoneyProps = {
  amountSyp: number;
  locale: string;
  /** Which currency leads; the other sits underneath as the approximate amount. */
  displayCurrency?: DisplayCurrency;
  /**
   * `cell` (default): right-aligned for narrow table columns. `kpi`: start-aligned under a KPI
   * label; the main amount keeps the card's large type and shrinks with the card (container
   * width) only when a long amount would not fit on one line.
   */
  variant?: "cell" | "kpi";
  /** Emphasise the main amount (e.g. what is owed). */
  strong?: boolean;
  /** Both lines in the small muted size (helper amounts under a percentage). */
  small?: boolean;
};

/**
 * A price on two lines: the main currency, then "(~US$ …)" underneath. Neither line ever wraps:
 * each sits in its own isolate with `whitespace-nowrap`, so in Arabic the USD part keeps "~US$"
 * and its digits together on one line.
 */
export function StackedMoney({
  amountSyp,
  locale,
  displayCurrency = "SYP",
  variant = "cell",
  strong = false,
  small = false,
}: StackedMoneyProps): ReactNode {
  const { primary, secondary } = formatSypParts(amountSyp, locale, displayCurrency);
  const kpi = variant === "kpi";
  // Each character is at most about 0.48em wide in the heading font (measured in EN and AR), so
  // this cap keeps the amount within the card's width (100cqi): it never wraps or overflows.
  const visibleChars = primary.replace(/[\u2066-\u2069]/g, "").length;
  const kpiFontSize = `min(1em, ${(100 / (0.48 * visibleChars)).toFixed(1)}cqi)`;
  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 tabular-nums",
        kpi ? "@container w-full items-start" : "items-end",
      )}
    >
      <bdi
        style={kpi ? { fontSize: kpiFontSize } : undefined}
        className={cn(
          "whitespace-nowrap",
          kpi
            ? null
            : small
              ? "text-prose-muted text-xs"
              : strong
                ? "font-medium"
                : "text-prose-muted",
        )}
      >
        {primary}
      </bdi>
      <bdi
        className={cn(
          "text-prose-muted whitespace-nowrap",
          kpi ? "font-sans text-sm font-normal tracking-normal" : "text-xs",
        )}
      >
        {secondary}
      </bdi>
    </div>
  );
}
