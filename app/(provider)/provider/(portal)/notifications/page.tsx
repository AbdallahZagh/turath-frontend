import type { ReactNode } from "react";

import { NotificationCenter } from "@/components/notifications/NotificationCenter";

export default function ProviderNotificationsPage(): ReactNode {
  return <NotificationCenter audience="provider" />;
}
