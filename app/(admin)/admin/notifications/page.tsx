import type { ReactNode } from "react";

import { NotificationCenter } from "@/components/notifications/NotificationCenter";

export default function AdminNotificationsPage(): ReactNode {
  return <NotificationCenter audience="admin" />;
}
