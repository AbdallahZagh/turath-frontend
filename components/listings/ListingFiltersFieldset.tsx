import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type ListingFiltersFieldsetProps = {
  legend: string;
  /** Classes for the option grid under the legend. */
  className?: string;
  children: ReactNode;
};

/**
 * A titled group of options under the listing filter fields (e.g. amenities). The divider sits on
 * its own wrapper, not on the fieldset, so the legend keeps the same space below the line in the
 * side panel and the mobile sheet instead of being drawn into the border.
 */
export function ListingFiltersFieldset({
  legend,
  className,
  children,
}: ListingFiltersFieldsetProps): ReactNode {
  return (
    <div className="border-border mt-5 border-t pt-5">
      <fieldset>
        <legend className="text-prose text-sm font-semibold">{legend}</legend>
        <div className={cn("mt-3 grid gap-3", className)}>{children}</div>
      </fieldset>
    </div>
  );
}
