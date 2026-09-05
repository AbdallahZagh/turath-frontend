"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, RotateCcw, ShieldOff, X } from "lucide-react";

import { AdminStarRating } from "@/components/admin/AdminStarRating";
import { providerStatusBadgeProps } from "@/components/admin/providerStatus";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import { initialsFromName } from "@/lib/format/initials";
import { localizedName } from "@/lib/i18n/localized";
import type { AdminProvider, ProviderStatus } from "@/lib/mock/adminProviders";

type AdminProviderProfileProps = {
  provider: AdminProvider;
  ratingAverage: number;
  ratingCount: number;
  statusPending: boolean;
  onStatus: (status: ProviderStatus) => void;
};

export function AdminProviderProfile({
  provider,
  ratingAverage,
  ratingCount,
  statusPending,
  onStatus,
}: AdminProviderProfileProps): ReactNode {
  const t = useTranslations("admin.providers");
  const tPillars = useTranslations("admin.overview.pillars");
  const tGov = useTranslations("landing.governorates");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const other: Locale = loc === "ar" ? "en" : "ar";
  const displayName = localizedName(provider.name, loc);

  return (
    <GlassPanel className="flex-none gap-5 p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
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
              <Badge {...providerStatusBadgeProps(provider.status)}>
                {t(`status.${provider.status}`)}
              </Badge>
            </div>
            <p className="text-prose-muted text-sm">{localizedName(provider.name, other)}</p>
            <AdminStarRating average={ratingAverage} count={ratingCount} size="md" />
            <p className="text-prose-muted text-sm leading-relaxed">
              {localizedName(provider.description, loc)}
            </p>
            <dl className="mt-1 grid gap-3 text-sm sm:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-0.5">
                <dt className="text-prose-muted text-xs">{t("detail.owner")}</dt>
                <dd>{localizedName(provider.owner, loc)}</dd>
              </div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <dt className="text-prose-muted text-xs">{t("columns.category")}</dt>
                <dd>{tPillars(provider.category)}</dd>
              </div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <dt className="text-prose-muted text-xs">{t("columns.governorate")}</dt>
                <dd>{tGov(provider.governorate)}</dd>
              </div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <dt className="text-prose-muted text-xs">{t("detail.address")}</dt>
                <dd>{localizedName(provider.address, loc)}</dd>
              </div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <dt className="text-prose-muted text-xs">{t("detail.phone")}</dt>
                <dd className="tabular-nums">{provider.phone}</dd>
              </div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <dt className="text-prose-muted text-xs">{t("detail.email")}</dt>
                <dd className="truncate">{provider.email}</dd>
              </div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <dt className="text-prose-muted text-xs">{t("detail.submitted")}</dt>
                <dd>{formatMediumDate(provider.submittedAt, loc)}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {provider.status === "pending" ? (
            <>
              <Button
                size="sm"
                disabled={statusPending}
                onClick={() => onStatus("approved")}
              >
                <Check className="size-4" aria-hidden />
                {t("detail.approve")}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={statusPending}
                onClick={() => onStatus("rejected")}
              >
                <X className="size-4" aria-hidden />
                {t("detail.reject")}
              </Button>
            </>
          ) : null}
          {provider.status === "approved" ? (
            <Button
              size="sm"
              variant="destructive"
              disabled={statusPending}
              onClick={() => onStatus("suspended")}
            >
              <ShieldOff className="size-4" aria-hidden />
              {t("detail.suspend")}
            </Button>
          ) : null}
          {provider.status === "suspended" ? (
            <Button
              size="sm"
              variant="glass"
              disabled={statusPending}
              onClick={() => onStatus("approved")}
            >
              <RotateCcw className="size-4" aria-hidden />
              {t("detail.reinstate")}
            </Button>
          ) : null}
          {provider.status === "rejected" ? (
            <p className="text-prose-muted max-w-xs text-xs leading-relaxed">
              {t("detail.noKycActions")}
            </p>
          ) : null}
        </div>
      </div>
    </GlassPanel>
  );
}
