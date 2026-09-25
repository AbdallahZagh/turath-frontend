import { useMutation, useQuery, useQueryClient, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query";

import type { NotificationAudience, PortalNotification } from "@/lib/mock/notifications";
import { getNotifications, markNotificationRead, markNotificationsRead } from "@/services/notifications";

const notificationKey = (audience: NotificationAudience) => ["notifications", audience] as const;

export function useNotifications(audience: NotificationAudience): UseQueryResult<PortalNotification[]> {
  return useQuery({ queryKey: notificationKey(audience), queryFn: () => getNotifications(audience), staleTime: 60_000 });
}

export function useMarkNotificationRead(audience: NotificationAudience): UseMutationResult<PortalNotification, Error, string> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: (updated) => {
      client.setQueryData<PortalNotification[]>(notificationKey(audience), (current = []) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    },
  });
}

export function useMarkAllNotificationsRead(audience: NotificationAudience): UseMutationResult<PortalNotification[], Error, void> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => markNotificationsRead(audience),
    onSuccess: (updated) => client.setQueryData(notificationKey(audience), updated),
  });
}
