import {
  getMockNotifications,
  markAllMockNotificationsRead,
  markMockNotificationRead,
  type NotificationAudience,
  type PortalNotification,
} from "@/lib/mock/notifications";

export async function getNotifications(audience: NotificationAudience): Promise<PortalNotification[]> {
  return getMockNotifications(audience);
}

export async function markNotificationRead(id: string): Promise<PortalNotification> {
  const notification = markMockNotificationRead(id);
  if (!notification) throw new Error("Notification not found");
  return notification;
}

export async function markNotificationsRead(audience: NotificationAudience): Promise<PortalNotification[]> {
  return markAllMockNotificationsRead(audience);
}
