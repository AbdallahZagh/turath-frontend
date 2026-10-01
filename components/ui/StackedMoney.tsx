import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatSypParts } from "@/lib/format/money";

type StackedMoneyProps = {
  amountSyp: number;
  locale: string;
  /** Emphasise the main amount (e.g. what is owed). */
  strong?: boolean;
  /** Both lines in the small muted size (helper amounts under a percentage). */
  small?: boolean;
};

/** A price on two lines for narrow table columns: SYP, then "(~US$ …)" underneath. */
export function StackedMoney({
  amountSyp,
  locale,
  strong = false,
  small = false,
}: StackedMoneyProps): ReactNode {
  const { primary, secondary } = formatSypParts(amountSyp, locale);
  return (
    <div className="flex flex-col items-end gap-0.5 tabular-nums">
      <span
        className={cn(
          "whitespace-nowrap",
          small ? "text-prose-muted text-xs" : strong ? "font-medium" : "text-prose-muted",
        )}
      >
        {primary}
      </span>
      <span className="text-prose-muted text-xs whitespace-nowrap">{secondary}</span>
    </div>
  );
}
