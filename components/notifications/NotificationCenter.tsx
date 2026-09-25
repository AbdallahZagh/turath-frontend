"use client";

import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { NOTIFICATION_ICONS } from "@/components/notifications/NotificationIcon";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "@/hooks/useNotifications";
import type { NotificationAudience } from "@/lib/mock/notifications";
import { cn } from "@/lib/cn";

export function NotificationCenter({ audience }: { audience: NotificationAudience }): ReactNode {
  const t = useTranslations("notifications");
  const tUi = useTranslations("ui");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const query = useNotifications(audience);
  const markRead = useMarkNotificationRead(audience);
  const markAll = useMarkAllNotificationsRead(audience);

  if (query.isPending) return <div className="space-y-3"><Skeleton className="h-16" /><Skeleton className="h-28" /><Skeleton className="h-28" /></div>;
  if (query.isError) return <ErrorState title={tUi("errorTitle")} description={tUi("errorDescription")} retryLabel={tUi("retry")} onRetry={() => void query.refetch()} />;

  const items = (query.data ?? []).filter((item) => filter === "all" || !item.read);
  const unread = (query.data ?? []).filter((item) => !item.read).length;

  return (
    <div className="space-y-5">
      <GlassPanel className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex rounded-xl bg-glass-control p-1" role="group" aria-label={t("filterLabel")}>
          {(["all", "unread"] as const).map((value) => (
            <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={cn("rounded-lg px-4 py-2 text-sm font-semibold transition-colors", filter === value ? "bg-primary text-primary-foreground" : "text-prose-muted hover:text-prose")}>
              {t(value)}{value === "unread" ? ` (${unread})` : ""}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" disabled={unread === 0 || markAll.isPending} onClick={() => markAll.mutate()}>
          <CheckCheck className="size-4" aria-hidden />{t("markAll")}
        </Button>
      </GlassPanel>

      {items.length === 0 ? (
        <EmptyState icon={Bell} title={filter === "unread" ? t("emptyUnreadTitle") : t("emptyTitle")} description={filter === "unread" ? t("emptyUnreadBody") : t("emptyBody")} />
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = NOTIFICATION_ICONS[item.kind];
            return (
              <GlassPanel key={item.id} className={cn("relative p-4 sm:p-5", !item.read && "ring-1 ring-primary/35")}>
                <div className="flex gap-3 sm:gap-4">
                  <span className="bg-primary/12 text-primary grid size-11 shrink-0 place-items-center rounded-2xl"><Icon className="size-5" aria-hidden /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <h2 className="text-prose font-semibold">{t(`items.${item.titleKey}`)}</h2>
                      <span className="text-prose-muted shrink-0 text-xs">{t(`times.${item.timeKey}`)}</span>
                    </div>
                    <p className="text-prose-muted mt-1 text-sm leading-relaxed">{t(`items.${item.bodyKey}`)}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <Link href={item.href} onClick={() => !item.read && markRead.mutate(item.id)} className="text-primary text-sm font-semibold">{t("openItem")}</Link>
                      {!item.read ? <button type="button" onClick={() => markRead.mutate(item.id)} className="text-prose-muted hover:text-prose text-sm">{t("markRead")}</button> : null}
                    </div>
                  </div>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      )}
    </div>
  );
}
