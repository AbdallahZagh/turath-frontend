import type { ReactNode } from "react";

import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { useTranslations } from "@/i18n/translations";
import type { TouristBookingStatus } from "@/lib/mock/bookings";

type BookingStatusStyle = { variant: BadgeVariant; className?: string };

const DESTRUCTIVE: BookingStatusStyle = {
  variant: "outline",
  className: "border-destructive text-destructive",
};

/**
 * One badge style per booking status, used by the user, business and admin portals. Pending
 * (dashed outline) and Confirmed (solid) are deliberately far apart.
 */
export const BOOKING_STATUS_STYLES: Record<TouristBookingStatus, BookingStatusStyle> = {
  PENDING_CONFIRMATION: {
    variant: "outline",
    className: "border-dashed border-accent text-accent",
  },
  CONFIRMED: { variant: "solid" },
  CHECKED_IN: { variant: "glass", className: "text-primary" },
  COMPLETED: { variant: "outline", className: "border-primary text-primary" },
  CANCELLED: DESTRUCTIVE,
  NO_SHOW: DESTRUCTIVE,
  DISPUTED: { variant: "warning" },
};

export function BookingStatusBadge({ status }: { status: TouristBookingStatus }): ReactNode {
  const t = useTranslations("bookings.voucher.status");
  return <Badge {...BOOKING_STATUS_STYLES[status]}>{t(status)}</Badge>;
}
