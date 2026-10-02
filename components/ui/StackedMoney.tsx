import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatSypParts, type DisplayCurrency } from "@/lib/format/money";

/**
 * KPI amount size, pure CSS: 13% of the card's content width (container query), never below 17px
 * or above 24px. 24px on wide cards (1280), down to 17px in the two-up phone grid (375), where
 * KpiCard pads 16px instead of 20px so "428,500,000 SYP" fits at 17px.
 */
const KPI_AMOUNT_SIZE = "text-[length:clamp(17px,13cqi,24px)]";

type StackedMoneyProps = {
  amountSyp: number;
  locale: string;
  /** Which currency leads; the other sits underneath as the approximate amount. */
  displayCurrency?: DisplayCurrency;
  /**
   * `cell` (default): right-aligned for narrow table columns. `kpi`: start-aligned under a KPI
   * label; the main amount is sized with a CSS clamp() on the card's width (17px to 24px).
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
  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 tabular-nums",
        kpi ? "@container w-full items-start" : "items-end",
      )}
    >
      <bdi
        className={cn(
          "break-normal whitespace-nowrap",
          kpi
            ? KPI_AMOUNT_SIZE
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
          "text-prose-muted break-normal whitespace-nowrap",
          kpi ? "font-sans text-sm font-normal tracking-normal" : "text-xs",
        )}
      >
        {secondary}
      </bdi>
    </div>
  );
}
