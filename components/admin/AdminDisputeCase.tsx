"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { Building2, CalendarCheck, UserRound } from "lucide-react";

import { ADMIN_PATHS } from "@/config/adminRoutes";
import { AdminNamedRating } from "@/components/admin/AdminNamedRating";
import { disputeStatusBadgeProps } from "@/components/admin/disputeStatus";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/translations";
import { formatMediumDate } from "@/lib/format/datetime";
import { formatSyp } from "@/lib/format/money";
import { partSeparator } from "@/lib/format/separators";
import { localizedName } from "@/lib/i18n/localized";
import type { AdminDispute } from "@/lib/mock/adminDisputes";

type AdminDisputeCaseProps = {
  dispute: AdminDispute;
  guestId: string | null;
  providerId: string | null;
  hasBooking: boolean;
  onOpenBooking: () => void;
};

export function AdminDisputeCase({
  dispute,
  guestId,
  providerId,
  hasBooking,
  onOpenBooking,
}: AdminDisputeCaseProps): ReactNode {
  const t = useTranslations("admin.disputes");
  const tPillars = useTranslations("admin.overview.pillars");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const other: Locale = loc === "ar" ? "en" : "ar";

  return (
    <GlassPanel className="flex-none gap-5 p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading text-prose text-2xl font-semibold tracking-widest tabular-nums">
              {dispute.bookingCode}
            </h2>
            <Badge {...disputeStatusBadgeProps(dispute.status)}>
              {t(`status.${dispute.status}`)}
            </Badge>
          </div>
          <p className="text-prose text-sm font-medium">
            <bdi>{localizedName(dispute.guest, loc)}</bdi>
            <span className="text-prose-muted">{partSeparator(loc)}</span>
            <bdi>{localizedName(dispute.provider, loc)}</bdi>
          </p>
          <p className="text-prose-muted text-sm">
            <bdi>{localizedName(dispute.guest, other)}</bdi>
            <span>{partSeparator(other)}</span>
            <bdi>{localizedName(dispute.provider, other)}</bdi>
          </p>
          <dl className="mt-1 grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-0.5">
              <dt className="text-prose-muted text-xs">{t("categoryLabel")}</dt>
              <dd>{tPillars(dispute.category)}</dd>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <dt className="text-prose-muted text-xs">{t("detail.opened")}</dt>
              <dd>{formatMediumDate(dispute.openedAt, loc)}</dd>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <dt className="text-prose-muted text-xs">{t("detail.guestRating")}</dt>
              <dd>
                <AdminNamedRating about="guest" nameEn={dispute.guest.en} />
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <dt className="text-prose-muted text-xs">{t("detail.providerRating")}</dt>
              <dd>
                <AdminNamedRating about="provider" nameEn={dispute.provider.en} />
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5 sm:col-span-2">
              <dt className="text-prose-muted text-xs">{t("columns.amount")}</dt>
              <dd className="font-medium tabular-nums">{formatSyp(dispute.amountSyp, loc)}</dd>
              <p className="text-prose-muted mt-1 text-xs leading-relaxed">
                {t("detail.amountHint")}
              </p>
            </div>
          </dl>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {guestId ? (
            <Button size="sm" variant="glass" href={ADMIN_PATHS.guest(guestId)}>
              <UserRound className="size-4" aria-hidden />
              {t("detail.openGuest")}
            </Button>
          ) : null}
          {providerId ? (
            <Button size="sm" variant="glass" href={ADMIN_PATHS.business(providerId)}>
              <Building2 className="size-4" aria-hidden />
              {t("detail.openProvider")}
            </Button>
          ) : null}
          {hasBooking ? (
            <Button size="sm" variant="glass" onClick={onOpenBooking}>
              <CalendarCheck className="size-4" aria-hidden />
              {t("detail.openBooking")}
            </Button>
          ) : null}
        </div>
      </div>
    </GlassPanel>
  );
}
