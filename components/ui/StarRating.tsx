import { Star } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

const STAR_COUNT = 5;

type StarRatingSize = "sm" | "md";

type StarRatingProps = {
  value: number;
  label: string;
  size?: StarRatingSize;
  className?: string;
};

const STAR_SIZE: Record<StarRatingSize, string> = {
  sm: "size-3.5",
  md: "size-4",
};

export function StarRating({
  value,
  label,
  size = "sm",
  className,
}: StarRatingProps): ReactNode {
  const filledTo = Math.round(Math.min(Math.max(value, 0), STAR_COUNT));

  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-label={label}
    >
      {Array.from({ length: STAR_COUNT }, (_, index) => (
        <Star
          key={index}
          className={cn(
            STAR_SIZE[size],
            index < filledTo ? "fill-accent text-accent" : "text-border",
          )}
          aria-hidden
        />
      ))}
    </span>
  );
}
