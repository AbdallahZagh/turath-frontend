import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  PanelLeftClose,
  PanelLeftOpen,
  Send,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * The only icons that mirror in right-to-left layouts: they point along the reading direction
 * (back/forward arrows, chevrons, panel toggles, send). Every other icon (Check, CheckCircle,
 * stars, clocks, …) keeps its shape in Arabic.
 */
export const RTL_MIRRORED_ICONS: ReadonlySet<LucideIcon> = new Set([
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  PanelLeftClose,
  PanelLeftOpen,
  Send,
]);

export const RTL_MIRROR_CLASS = "rtl:-scale-x-100";

type IconProps = LucideProps & { icon: LucideIcon };

/** A Lucide icon that mirrors in RTL only when it is on the allowlist above. */
export function Icon({ icon: Glyph, className, ...props }: IconProps): ReactNode {
  return (
    <Glyph
      className={cn(className, RTL_MIRRORED_ICONS.has(Glyph) && RTL_MIRROR_CLASS)}
      {...props}
    />
  );
}
