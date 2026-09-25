import { BellRing, CalendarCheck, CircleCheckBig, MessageSquareQuote, ShieldAlert, type LucideIcon } from "lucide-react";

import type { NotificationKind } from "@/lib/mock/notifications";

export const NOTIFICATION_ICONS: Record<NotificationKind, LucideIcon> = {
  booking: CalendarCheck,
  approval: CircleCheckBig,
  review: MessageSquareQuote,
  reminder: BellRing,
  system: ShieldAlert,
};
