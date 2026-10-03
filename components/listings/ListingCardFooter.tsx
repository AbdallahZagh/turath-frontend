import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type ListingCardFooterProps = {
  /** Layout of the footer row (flex or grid, gaps, text size). */
  className?: string;
  children: ReactNode;
};

/**
 * Bottom row of a listing card (price, capacity, next date) under a divider. It is pushed to the
 * card's bottom so footers line up across a row, and always keeps 1rem above the divider, so the
 * line never touches the amenity or feature row when a card is the tallest in its row.
 */
export function ListingCardFooter({ className, children }: ListingCardFooterProps): ReactNode {
  return (
    <div className="mt-auto pt-4">
      <div className={cn("border-border border-t pt-4", className)}>{children}</div>
    </div>
  );
}
