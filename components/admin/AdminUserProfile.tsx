"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Lock, Unlock } from "lucide-react";

import { AdminStarRating } from "@/components/admin/AdminStarRating";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import { initialsFromName } from "@/lib/format/initials";
import { localizedName } from "@/lib/i18n/localized";
import type { AdminUser } from "@/lib/mock/adminUsers";

type AdminUserProfileProps = {
  user: AdminUser;
  ratingAverage: number;
  ratingCount: number;
  lockPending: boolean;
  onToggleLock: () => void;
};

export function AdminUserProfile({
  user,
  ratingAverage,
  ratingCount,
  lockPending,
  onToggleLock,
}: AdminUserProfileProps): ReactNode {
  const t = useTranslations("admin.users");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const other: Locale = loc === "ar" ? "en" : "ar";
  const displayName = localizedName(user.name, loc);

  return (
    <GlassPanel className="flex-none gap-5 p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span
            aria-hidden
            className="bg-glass-control text-prose flex size-16 shrink-0 items-center justify-center rounded-full text-lg font-semibold"
          >
            {initialsFromName(displayName)}
          </span>
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-prose text-2xl font-semibold tracking-tight">
                {displayName}
              </h2>
              {user.locked ? (
                <Badge variant="outline" className="text-destructive border-destructive">
                  {t("locked")}
                </Badge>
              ) : null}
            </div>
            <p className="text-prose-muted text-sm">{localizedName(user.name, other)}</p>
            <AdminStarRating average={ratingAverage} count={ratingCount} size="md" />
            <dl className="mt-1 grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-0.5">
                <dt className="text-prose-muted text-xs">{t("detail.phone")}</dt>
                <dd className="tabular-nums">{user.phone}</dd>
              </div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <dt className="text-prose-muted text-xs">{t("detail.email")}</dt>
                <dd className="truncate">{user.email}</dd>
              </div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <dt className="text-prose-muted text-xs">{t("detail.joined")}</dt>
                <dd>{formatMediumDate(user.joinedAt, loc)}</dd>
              </div>
            </dl>
          </div>
        </div>
        <Button
          size="sm"
          variant={user.locked ? "glass" : "destructive"}
          disabled={lockPending}
          onClick={onToggleLock}
          className="shrink-0 self-start"
        >
          {user.locked ? (
            <Unlock className="size-4" aria-hidden />
          ) : (
            <Lock className="size-4" aria-hidden />
          )}
          {user.locked ? t("detail.unlock") : t("detail.lock")}
        </Button>
      </div>
    </GlassPanel>
  );
}
