export type NotificationAudience = "tourist" | "provider" | "admin";
export type NotificationKind = "booking" | "approval" | "review" | "reminder" | "system";
export type NotificationTitleKey =
  | "touristBooking"
  | "touristReminder"
  | "touristReview"
  | "providerBooking"
  | "providerArrival"
  | "providerReview"
  | "adminApproval"
  | "adminNoShow"
  | "adminReview";
export type NotificationBodyKey = `${NotificationTitleKey}Body`;
export type NotificationTimeKey = "minutes" | "hours" | "yesterday";

export type PortalNotification = {
  id: string;
  audience: NotificationAudience;
  kind: NotificationKind;
  titleKey: NotificationTitleKey;
  bodyKey: NotificationBodyKey;
  timeKey: NotificationTimeKey;
  href: string;
  read: boolean;
};

const notifications: PortalNotification[] = [
  { id: "tourist-1", audience: "tourist", kind: "booking", titleKey: "touristBooking", bodyKey: "touristBookingBody", timeKey: "minutes", href: "/user/bookings", read: false },
  { id: "tourist-2", audience: "tourist", kind: "reminder", titleKey: "touristReminder", bodyKey: "touristReminderBody", timeKey: "hours", href: "/user/bookings", read: false },
  { id: "tourist-3", audience: "tourist", kind: "review", titleKey: "touristReview", bodyKey: "touristReviewBody", timeKey: "yesterday", href: "/user/bookings", read: true },
  { id: "provider-1", audience: "provider", kind: "booking", titleKey: "providerBooking", bodyKey: "providerBookingBody", timeKey: "minutes", href: "/provider/bookings", read: false },
  { id: "provider-2", audience: "provider", kind: "reminder", titleKey: "providerArrival", bodyKey: "providerArrivalBody", timeKey: "hours", href: "/provider/check-in", read: false },
  { id: "provider-3", audience: "provider", kind: "review", titleKey: "providerReview", bodyKey: "providerReviewBody", timeKey: "yesterday", href: "/provider/reviews", read: true },
  { id: "admin-1", audience: "admin", kind: "approval", titleKey: "adminApproval", bodyKey: "adminApprovalBody", timeKey: "minutes", href: "/admin/businesses", read: false },
  { id: "admin-2", audience: "admin", kind: "system", titleKey: "adminNoShow", bodyKey: "adminNoShowBody", timeKey: "hours", href: "/admin/no-shows", read: false },
  { id: "admin-3", audience: "admin", kind: "review", titleKey: "adminReview", bodyKey: "adminReviewBody", timeKey: "yesterday", href: "/admin/reviews", read: true },
];

function clone(item: PortalNotification): PortalNotification {
  return { ...item };
}

export function getMockNotifications(audience: NotificationAudience): PortalNotification[] {
  return notifications.filter((item) => item.audience === audience).map(clone);
}

export function markMockNotificationRead(id: string): PortalNotification | undefined {
  const item = notifications.find((notification) => notification.id === id);
  if (!item) return undefined;
  item.read = true;
  return clone(item);
}

export function markAllMockNotificationsRead(audience: NotificationAudience): PortalNotification[] {
  notifications.forEach((item) => {
    if (item.audience === audience) item.read = true;
  });
  return getMockNotifications(audience);
}
