"use client";

import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { NOTIFICATION_ICONS } from "@/components/notifications/NotificationIcon";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "@/hooks/useNotifications";
import type { NotificationAudience } from "@/lib/mock/notifications";

type NotificationBellProps = {
  audience: NotificationAudience;
  href: string;
};

export function NotificationBell({ audience, href }: NotificationBellProps): ReactNode {
  const t = useTranslations("notifications");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const query = useNotifications(audience);
  const markRead = useMarkNotificationRead(audience);
  const markAll = useMarkAllNotificationsRead(audience);
  const items = query.data ?? [];
  const unread = items.filter((item) => !item.read).length;

  useEffect(() => {
    if (!open) return;
    function close(event: PointerEvent): void {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={t("open")}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="bg-glass-control text-prose-muted hover:text-prose relative grid size-9 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Bell className="size-4" aria-hidden />
        {unread > 0 ? (
          <span className="bg-accent text-ink absolute -end-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full px-1 text-[0.6rem] font-bold leading-4">
            {unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <section
          role="dialog"
          aria-label={t("title")}
          className="glass-surface text-prose absolute end-0 top-12 z-50 w-[min(23rem,calc(100vw-2rem))] overflow-hidden rounded-glass shadow-xl backdrop-blur-xl"
        >
          <div className="border-glass-border flex items-center justify-between gap-3 border-b px-4 py-3">
            <div>
              <h2 className="font-heading text-base font-semibold">{t("title")}</h2>
              <p className="text-prose-muted text-xs">{t("unreadCount", { count: unread })}</p>
            </div>
            {unread > 0 ? (
              <button type="button" onClick={() => markAll.mutate()} className="text-primary inline-flex items-center gap-1.5 text-xs font-semibold">
                <CheckCheck className="size-3.5" aria-hidden />
                {t("markAll")}
              </button>
            ) : null}
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {items.slice(0, 3).map((item) => {
              const Icon = NOTIFICATION_ICONS[item.kind];
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    if (!item.read) markRead.mutate(item.id);
                    setOpen(false);
                  }}
                  className="hover:bg-option-hover flex gap-3 rounded-2xl p-3 transition-colors"
                >
                  <span className="bg-primary/12 text-primary grid size-9 shrink-0 place-items-center rounded-xl"><Icon className="size-4" aria-hidden /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start gap-2">
                      <span className="flex-1 text-sm font-semibold">{t(`items.${item.titleKey}`)}</span>
                      {!item.read ? <span className="bg-primary mt-1.5 size-2 shrink-0 rounded-full" aria-label={t("unread")} /> : null}
                    </span>
                    <span className="text-prose-muted mt-0.5 line-clamp-2 text-xs leading-relaxed">{t(`items.${item.bodyKey}`)}</span>
                    <span className="text-primary mt-1 block text-[0.7rem] font-medium">{t(`times.${item.timeKey}`)}</span>
                  </span>
                </Link>
              );
            })}
          </div>
          <Link href={href} onClick={() => setOpen(false)} className="border-glass-border text-primary hover:bg-option-hover block border-t px-4 py-3 text-center text-sm font-semibold">
            {t("viewAll")}
          </Link>
        </section>
      ) : null}
    </div>
  );
}
