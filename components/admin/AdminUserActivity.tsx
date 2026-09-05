"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/Badge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SegmentSwitch } from "@/components/ui/SegmentSwitch";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import { formatSyp } from "@/lib/format/money";
import { localizedName } from "@/lib/i18n/localized";
import {
  USER_ACTIVITY_CHANNELS,
  type AdminUserActivityEvent,
  type UserActivityChannel,
} from "@/lib/mock/adminUserActivity";

const ALL = "all";

type ChannelFilter = typeof ALL | UserActivityChannel;

function isChannelFilter(value: string): value is ChannelFilter {
  return value === ALL || (USER_ACTIVITY_CHANNELS as readonly string[]).includes(value);
}

function kindBadgeClass(kind: AdminUserActivityEvent["kind"]): string | undefined {
  if (kind === "locked" || kind === "noShow" || kind === "disputed" || kind === "cancelled") {
    return "text-destructive border-destructive";
  }
  if (kind === "completed" || kind === "checkedIn") {
    return undefined;
  }
  return undefined;
}

type AdminUserActivityProps = {
  events: AdminUserActivityEvent[];
};

export function AdminUserActivity({ events }: AdminUserActivityProps): ReactNode {
  const t = useTranslations("admin.users");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const [channel, setChannel] = useState<ChannelFilter>(ALL);

  const visible = useMemo(() => {
    if (channel === ALL) {
      return events;
    }
    return events.filter((event) => event.channels.includes(channel));
  }, [events, channel]);

  return (
    <GlassPanel className="flex-none gap-4 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-prose text-lg font-semibold">{t("detail.activityTitle")}</h2>
        <SegmentSwitch
          size="sm"
          variant="glass"
          className="w-full sm:w-auto"
          aria-label={t("detail.activityFilter")}
          value={channel}
          onChange={(value) => {
            if (isChannelFilter(value)) {
              setChannel(value);
            }
          }}
          options={[
            { value: ALL, label: t("detail.activityChannel.all") },
            { value: "bookings", label: t("detail.activityChannel.bookings") },
            { value: "money", label: t("detail.activityChannel.money") },
            { value: "account", label: t("detail.activityChannel.account") },
          ]}
        />
      </div>
      {visible.length === 0 ? (
        <p className="text-prose-muted text-sm">{t("detail.activityEmpty")}</p>
      ) : (
        <ol className="divide-glass-border flex flex-col divide-y">
          {visible.map((event) => {
            const destructive = Boolean(kindBadgeClass(event.kind));
            const line = event.provider
              ? localizedName(event.provider, loc)
              : t(`detail.activityKind.${event.kind}`);

            return (
              <li
                key={event.id}
                className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3"
              >
                <time
                  dateTime={event.at}
                  className="text-prose-muted w-28 shrink-0 text-sm whitespace-nowrap"
                >
                  {formatMediumDate(event.at, loc)}
                </time>
                <Badge
                  variant={destructive ? "outline" : event.channels.includes("money") ? "solid" : "glass"}
                  className={kindBadgeClass(event.kind)}
                >
                  {t(`detail.activityKind.${event.kind}`)}
                </Badge>
                <span className="text-prose min-w-0 flex-1 truncate text-sm">{line}</span>
                {event.amountSyp !== undefined ? (
                  <span className="text-prose shrink-0 text-sm font-medium tabular-nums">
                    {formatSyp(event.amountSyp, loc)}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      )}
    </GlassPanel>
  );
}
