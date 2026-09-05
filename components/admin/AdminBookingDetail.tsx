"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  AlertTriangle,
  ArrowUpRight,
  Banknote,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Compass,
  Copy,
  Hotel,
  KeyRound,
  PartyPopper,
  Phone,
  RotateCcw,
  TicketPercent,
  User,
  UserRound,
  UtensilsCrossed,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import { AdminNamedRating } from "@/components/admin/AdminNamedRating";
import { bookingStatusBadgeProps } from "@/components/admin/bookingStatus";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ADMIN_PATHS } from "@/config/adminRoutes";
import { useUpdateAdminBookingStatus } from "@/hooks/useAdminBookings";
import type { Locale } from "@/i18n/config";
import { formatBookingWhen } from "@/lib/format/booking";
import { initialsFromName } from "@/lib/format/initials";
import { formatSyp } from "@/lib/format/money";
import { localizedName } from "@/lib/i18n/localized";
import type { AdminBooking, BookingStatus } from "@/lib/mock/adminBookings";
import { findAdminProviderIdByName } from "@/lib/mock/adminProviders";
import { findAdminUserIdByName } from "@/lib/mock/adminUsers";
import type { LandingPillarId } from "@/lib/mock/landing";
import { toast } from "@/store/toastStore";

const PILLAR_ICONS: Record<LandingPillarId, LucideIcon> = {
  hotels: Hotel,
  dining: UtensilsCrossed,
  trips: Compass,
  events: PartyPopper,
  guides: UserRound,
};

type AdminBookingDetailProps = {
  booking: AdminBooking;
};

export function AdminBookingDetail({ booking }: AdminBookingDetailProps): ReactNode {
  const t = useTranslations("admin.bookings");
  const tPillars = useTranslations("admin.overview.pillars");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const other: Locale = loc === "ar" ? "en" : "ar";

  const [copied, setCopied] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(booking.status);
  const updateStatus = useUpdateAdminBookingStatus();

  const PillarIcon = PILLAR_ICONS[booking.category] ?? Building2;

  const guestName = localizedName(booking.guest, loc);
  const guestOtherName = localizedName(booking.guest, other);
  const providerName = localizedName(booking.provider, loc);
  const providerOtherName = localizedName(booking.provider, other);

  const guestId = useMemo(
    () => findAdminUserIdByName(booking.guest.en),
    [booking.guest.en],
  );
  const providerId = useMemo(
    () => findAdminProviderIdByName(booking.provider.en),
    [booking.provider.en],
  );

  function handleCopyCode(): void {
    void navigator.clipboard.writeText(booking.code);
    setCopied(true);
    toast.success(t("detail.copiedCode"), booking.code);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleStatusChange(nextStatus: BookingStatus): void {
    updateStatus.mutate(
      { id: booking.id, status: nextStatus },
      {
        onSuccess: () => {
          setCurrentStatus(nextStatus);
          toast.success(
            t("detail.statusUpdatedTitle"),
            t("detail.statusUpdatedBody", { status: t(`status.${nextStatus}`) }),
          );
        },
        onError: () => {
          toast.error(t("detail.statusUpdateFailed"), t("detail.statusUpdateFailedBody"));
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-2">
          <Badge {...bookingStatusBadgeProps(currentStatus)}>
            {t(`status.${currentStatus}`)}
          </Badge>
          <Badge variant="glass" icon={<PillarIcon className="size-3.5" aria-hidden />}>
            {tPillars(booking.category)}
          </Badge>
        </div>

        <div>
          <p className="text-prose-muted text-xs font-medium">{t("detail.amountDue")}</p>
          <div className="flex flex-wrap items-baseline gap-2.5">
            <p className="font-heading text-prose mt-1 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
              {formatSyp(booking.amountSyp, loc)}
            </p>
            {booking.originalAmountSyp && booking.originalAmountSyp > booking.amountSyp ? (
              <span className="text-prose-muted text-sm line-through tabular-nums">
                {formatSyp(booking.originalAmountSyp, loc)}
              </span>
            ) : null}
          </div>
        </div>

        <div className="border-glass-border bg-glass-control/40 flex items-center gap-2 rounded-xl border px-3 py-2 text-xs text-prose">
          <Banknote className="text-accent size-4 shrink-0" aria-hidden />
          <span className="leading-relaxed">{t("detail.cashOnArrival")}</span>
        </div>
      </GlassPanel>

      <div className="border-glass-border bg-glass-control/30 flex items-center justify-between gap-3 rounded-2xl border p-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="bg-glass-control text-prose flex size-10 shrink-0 items-center justify-center rounded-xl">
            <KeyRound className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-prose text-xs font-semibold">{t("detail.code")}</p>
            <p className="text-prose-muted mt-0.5 text-xs">{t("detail.codeHint")}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="border-border bg-app-muted/40 text-prose rounded-lg border px-3 py-1 font-mono text-base font-bold tracking-[0.2em] tabular-nums">
            {booking.code}
          </span>
          <button
            type="button"
            onClick={handleCopyCode}
            aria-label={t("detail.copyCode")}
            className="border-glass-border bg-glass-control text-prose-muted hover:text-prose flex size-9 items-center justify-center rounded-lg border transition-colors"
          >
            {copied ? (
              <Check className="text-success size-4" aria-hidden />
            ) : (
              <Copy className="size-4" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {booking.couponCode ? (
        <GlassPanel className="flex flex-col gap-3 p-4.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-accent">
              <TicketPercent className="size-4 shrink-0" aria-hidden />
              <span>{t("detail.couponTitle")}</span>
            </div>
            <span className="font-mono text-xs font-bold tracking-wider text-prose border border-accent/30 bg-accent/10 px-2 py-0.5 rounded-md">
              {booking.couponCode}
            </span>
          </div>
          {booking.discountSyp ? (
            <div className="flex items-center justify-between text-xs">
              <span className="text-prose-muted">{t("detail.discountAmount")}</span>
              <span className="text-success font-semibold tabular-nums">
                -{formatSyp(booking.discountSyp, loc)}
              </span>
            </div>
          ) : null}
          <p className="text-prose-muted text-xs leading-relaxed">
            {t("detail.couponHint")}
          </p>
        </GlassPanel>
      ) : null}

      <GlassPanel className="flex flex-col gap-2.5 p-4.5">
        <div className="text-prose-muted flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
          <CalendarDays className="text-accent size-4" aria-hidden />
          <span>{t("detail.schedule")}</span>
        </div>
        <p className="text-prose text-sm font-medium">
          {formatBookingWhen(booking.when, loc)}
        </p>
      </GlassPanel>

      <GlassPanel className="flex flex-col gap-4 p-5">
        <div className="text-prose-muted flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
          <User className="text-accent size-4" aria-hidden />
          <span>{t("detail.parties")}</span>
        </div>

        <div className="flex items-start gap-3.5">
          <span className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
            {initialsFromName(guestName)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-prose text-sm font-semibold">{guestName}</p>
              <span className="text-prose-muted text-xs">{t("detail.guest")}</span>
            </div>
            {guestOtherName !== guestName ? (
              <p className="text-prose-muted mt-0.5 text-xs">{guestOtherName}</p>
            ) : null}
            <div className="mt-1.5">
              <AdminNamedRating about="guest" nameEn={booking.guest.en} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              <a
                href={`tel:${booking.phone}`}
                className="text-prose hover:text-primary inline-flex items-center gap-1.5 text-xs font-medium transition-colors tabular-nums"
              >
                <Phone className="text-prose-muted size-3.5" aria-hidden />
                <span>{booking.phone}</span>
              </a>
              {guestId ? (
                <Button
                  size="sm"
                  variant="glass"
                  href={ADMIN_PATHS.guest(guestId)}
                  className="text-xs h-7 px-2"
                >
                  <span>{t("detail.openGuest")}</span>
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="border-glass-border border-t" />

        <div className="flex items-start gap-3.5">
          <span className="bg-glass-control text-prose flex size-10 shrink-0 items-center justify-center rounded-full text-xs">
            <PillarIcon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-prose text-sm font-semibold">{providerName}</p>
              <span className="text-prose-muted text-xs">{t("detail.provider")}</span>
            </div>
            {providerOtherName !== providerName ? (
              <p className="text-prose-muted mt-0.5 text-xs">{providerOtherName}</p>
            ) : null}
            <div className="mt-1.5">
              <AdminNamedRating about="provider" nameEn={booking.provider.en} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              <span className="text-prose-muted text-xs">{tPillars(booking.category)}</span>
              {providerId ? (
                <Button
                  size="sm"
                  variant="glass"
                  href={ADMIN_PATHS.business(providerId)}
                  className="text-xs h-7 px-2"
                >
                  <span>{t("detail.openProvider")}</span>
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </GlassPanel>

      <GlassPanel className="flex flex-col gap-3.5 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-prose text-xs font-semibold tracking-wider uppercase">
            {t("detail.actionsTitle")}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentStatus === "pending" || currentStatus === "confirmed" ? (
            <>
              <Button
                size="sm"
                variant="solid"
                disabled={updateStatus.isPending}
                onClick={() => handleStatusChange("checkedIn")}
                className="flex items-center gap-1.5"
              >
                <CheckCircle2 className="size-4" aria-hidden />
                <span>{t("detail.actionCheckIn")}</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={updateStatus.isPending}
                onClick={() => handleStatusChange("noShow")}
                className="flex items-center gap-1.5"
              >
                <AlertTriangle className="size-4" aria-hidden />
                <span>{t("detail.actionNoShow")}</span>
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={updateStatus.isPending}
                onClick={() => handleStatusChange("cancelled")}
              >
                <XCircle className="size-4" aria-hidden />
                <span>{t("detail.actionCancel")}</span>
              </Button>
            </>
          ) : null}

          {currentStatus === "checkedIn" ? (
            <>
              <Button
                size="sm"
                variant="solid"
                disabled={updateStatus.isPending}
                onClick={() => handleStatusChange("completed")}
                className="flex items-center gap-1.5"
              >
                <CheckCircle2 className="size-4" aria-hidden />
                <span>{t("detail.actionComplete")}</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={updateStatus.isPending}
                onClick={() => handleStatusChange("disputed")}
                className="flex items-center gap-1.5"
              >
                <AlertTriangle className="size-4" aria-hidden />
                <span>{t("detail.actionDispute")}</span>
              </Button>
            </>
          ) : null}

          {currentStatus === "cancelled" ||
          currentStatus === "noShow" ||
          currentStatus === "completed" ||
          currentStatus === "disputed" ? (
            <Button
              size="sm"
              variant="glass"
              disabled={updateStatus.isPending}
              onClick={() => handleStatusChange("confirmed")}
              className="flex items-center gap-1.5"
            >
              <RotateCcw className="size-4" aria-hidden />
              <span>{t("detail.actionReopen")}</span>
            </Button>
          ) : null}
        </div>
      </GlassPanel>
    </div>
  );
}
