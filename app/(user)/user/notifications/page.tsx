import type { ReactNode } from "react";

import { NotificationCenter } from "@/components/notifications/NotificationCenter";

export default function UserNotificationsPage(): ReactNode {
  return <NotificationCenter audience="tourist" />;
}
