"use client";

import { format } from "date-fns";
import {
  ArrowLeft,
  Banknote,
  CalendarClock,
  Check,
  Copy,
  DoorOpen,
  Inbox,
  KeyRound,
  Phone,
  ScanLine,
  StickyNote,
  TicketPercent,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { PROVIDER_PATHS, providerCheckInPath } from "@/config/providerRoutes";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import {
  useProviderBooking,
  useUpdateProviderBookingStatus,
} from "@/hooks/useProviderBookings";
import type { Locale } from "@/i18n/config";
import { dateFnsLocale } from "@/lib/format/datetime";
import { localizedName } from "@/lib/i18n/localized";
import type { TouristBookingStatus } from "@/lib/mock/bookings";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/store/toastStore";

const BookingQr = dynamic(
  () => import("qrcode.react").then((module) => module.QRCodeSVG),
  { ssr: false, loading: () => <Skeleton className="size-40 rounded-xl" /> },
);

function statusBadge(status: TouristBookingStatus): {
  variant: "solid" | "glass" | "outline";
  className?: string;
} {
  if (status === "CHECKED_IN") return { variant: "solid" };
  if (status === "PENDING" || status === "CONFIRMED") {
    return { variant: "glass", className: "text-accent" };
  }
  return { variant: "outline", className: "border-destructive text-destructive" };
}

export function ProviderBookingDetailScreen({ id }: { id: string }): ReactNode {
  const t = useTranslations("provider.bookings");
  const tUi = useTranslations("ui");
  const rawLocale = useLocale();
  const locale: Locale = rawLocale === "ar" ? "ar" : "en";
  const formatMoney = useFormatSyp();
  const role = useAuthStore((state) => state.user.role);
  const query = useProviderBooking(id);
  const updateStatus = useUpdateProviderBookingStatus();
  const [copied, setCopied] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<"NO_SHOW" | "CANCELLED" | null>(null);

  if (query.isPending) {
    return (
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Skeleton className="h-[42rem]" />
        <Skeleton className="h-[34rem]" />
      </div>
    );
  }

  if (query.isError) {
    return (
      <ErrorState
        title={tUi("errorTitle")}
        description={tUi("errorDescription")}
        retryLabel={tUi("retry")}
        onRetry={() => void query.refetch()}
      />
    );
  }

  if (!query.data) {
    return (
      <EmptyState
        icon={Inbox}
        title={t("detail.notFoundTitle")}
        description={t("detail.notFoundDescription")}
        action={<Button href={PROVIDER_PATHS.bookings}>{t("detail.back")}</Button>}
      />
    );
  }

  const booking = query.data;
  const canChangeStatus =
    role === "PROVIDER_OWNER" &&
    (booking.status === "PENDING" || booking.status === "CONFIRMED");

  function copyBackupCode(): void {
    void navigator.clipboard.writeText(booking.backupCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function confirmStatus(): void {
    if (!pendingStatus) return;
    updateStatus.mutate(
      { id: booking.id, status: pendingStatus },
      {
        onSuccess: () => {
          toast.success(t("detail.updatedTitle"), t(`detail.updated.${pendingStatus}`));
          setPendingStatus(null);
        },
        onError: () => {
          toast.error(tUi("errorTitle"), tUi("errorDescription"));
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button href={PROVIDER_PATHS.bookings} variant="glass" size="sm">
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
          {t("detail.back")}
        </Button>
        <div className="flex items-center gap-2">
          <Badge {...statusBadge(booking.status)}>{t(`status.${booking.status}`)}</Badge>
          <Badge variant="outline">{booking.reference}</Badge>
        </div>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex min-w-0 flex-col gap-5">
          <GlassPanel className="overflow-hidden p-0">
            <div className="border-border flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-center gap-3">
                <span className="bg-primary/12 text-primary grid size-11 place-items-center rounded-2xl">
                  <UserRound className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-prose-muted text-xs font-semibold uppercase tracking-wide">{t("detail.guest")}</p>
                  <h2 className="font-heading text-prose mt-1 text-2xl font-semibold">
                    {localizedName(booking.guestName, locale)}
                  </h2>
                </div>
              </div>
              <a
                href={`tel:${booking.phone}`}
                className="border-border bg-glass-control text-prose hover:text-primary inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors"
                dir="ltr"
              >
                <Phone className="size-4" aria-hidden />
                {booking.phone}
              </a>
            </div>

            <dl className="grid sm:grid-cols-2">
              <Detail
                icon={CalendarClock}
                label={t("detail.arrival")}
                value={format(new Date(booking.scheduledAt), "PPp", { locale: dateFnsLocale(locale) })}
              />
              <Detail
                icon={CalendarClock}
                label={t("detail.departure")}
                value={format(new Date(booking.endsAt), "PPp", { locale: dateFnsLocale(locale) })}
              />
              <Detail
                icon={DoorOpen}
                label={t("detail.room")}
                value={localizedName(booking.roomName, locale)}
              />
              <Detail
                icon={UsersRound}
                label={t("detail.party")}
                value={t("party", { count: booking.partySize })}
              />
            </dl>
          </GlassPanel>

          <GlassPanel className="p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="bg-option-hover text-primary grid size-9 shrink-0 place-items-center rounded-xl">
                <StickyNote className="size-4" aria-hidden />
              </span>
              <div>
                <h2 className="text-prose font-semibold">{t("detail.notes")}</h2>
                <p className="text-prose-muted mt-2 text-sm leading-7">{booking.notes}</p>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Banknote className="text-primary size-5" aria-hidden />
              <h2 className="font-heading text-prose text-xl font-semibold">{t("detail.paymentTitle")}</h2>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-prose-muted">{t("detail.listPrice")}</dt>
                <dd className="text-prose font-semibold tabular-nums">{formatMoney(booking.listPriceSyp)}</dd>
              </div>
              {booking.discountSyp > 0 ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-prose-muted flex items-center gap-2">
                    <TicketPercent className="text-primary size-4" aria-hidden />
                    {t("detail.discount", { code: booking.couponCode ?? "" })}
                  </dt>
                  <dd className="text-primary font-semibold tabular-nums">−{formatMoney(booking.discountSyp)}</dd>
                </div>
              ) : null}
              <div className="border-border flex items-end justify-between gap-4 border-t pt-4">
                <dt>
                  <p className="text-prose font-semibold">{t("detail.cashDue")}</p>
                  <p className="text-prose-muted mt-1 text-xs">{t("detail.cashHint")}</p>
                </dt>
                <dd className="font-heading text-prose text-2xl font-semibold tabular-nums">
                  {formatMoney(booking.cashDueSyp)}
                </dd>
              </div>
            </dl>
          </GlassPanel>
        </div>

        <aside className="flex flex-col gap-5 xl:sticky xl:top-24">
          <GlassPanel className="items-center p-5 text-center sm:p-6">
            <p className="text-primary text-xs font-bold uppercase tracking-[0.14em]">{t("detail.deskPass")}</p>
            <div className="mt-4 rounded-xl border border-border bg-white p-2.5 shadow-sm">
              <BookingQr value={booking.qrPayload} size={160} level="M" />
            </div>
            <p className="text-prose-muted mt-4 text-xs">{t("detail.scanHint")}</p>
            <div className="border-border mt-5 w-full border-t pt-5">
              <p className="text-prose-muted text-xs font-semibold uppercase tracking-wide">{t("detail.backupCode")}</p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <code className="text-prose font-mono text-xl font-bold tracking-[0.22em]">{booking.backupCode}</code>
                <button
                  type="button"
                  className="border-border bg-glass-control text-prose-muted hover:text-primary grid size-9 place-items-center rounded-lg border transition-colors"
                  onClick={copyBackupCode}
                  aria-label={t("detail.copyCode")}
                >
                  {copied ? <Check className="text-primary size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                </button>
              </div>
            </div>
            {(booking.status === "CONFIRMED" || booking.status === "PENDING") ? (
              <Button href={providerCheckInPath(booking.backupCode)} className="mt-5 w-full">
                <ScanLine className="size-4" aria-hidden />
                {t("detail.checkIn")}
              </Button>
            ) : null}
          </GlassPanel>

          {canChangeStatus ? (
            <GlassPanel className="p-5">
              <div className="flex items-center gap-2">
                <KeyRound className="text-primary size-4" aria-hidden />
                <h2 className="text-prose font-semibold">{t("detail.ownerActions")}</h2>
              </div>
              <p className="text-prose-muted mt-2 text-xs leading-relaxed">{t("detail.ownerActionsHint")}</p>
              <div className="mt-4 grid gap-2">
                <Button variant="outline" size="sm" onClick={() => setPendingStatus("NO_SHOW")}>
                  {t("detail.markNoShow")}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setPendingStatus("CANCELLED")}>
                  {t("detail.cancelBooking")}
                </Button>
              </div>
            </GlassPanel>
          ) : null}
        </aside>
      </div>

      <ConfirmDialog
        open={pendingStatus !== null}
        onClose={() => setPendingStatus(null)}
        onConfirm={confirmStatus}
        pending={updateStatus.isPending}
        title={pendingStatus === "NO_SHOW" ? t("detail.noShowDialog.title") : t("detail.cancelDialog.title")}
        description={pendingStatus === "NO_SHOW" ? t("detail.noShowDialog.description") : t("detail.cancelDialog.description")}
        confirmLabel={pendingStatus === "NO_SHOW" ? t("detail.markNoShow") : t("detail.cancelBooking")}
        cancelLabel={t("detail.keepBooking")}
      />
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}): ReactNode {
  return (
    <div className="border-border flex items-start gap-3 border-b p-5 last:border-b-0 sm:border-e sm:p-6 sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(even)]:border-e-0">
      <span className="bg-option-hover text-primary grid size-9 shrink-0 place-items-center rounded-xl">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <dt className="text-prose-muted text-xs">{label}</dt>
        <dd className="text-prose mt-1 text-sm font-semibold">{value}</dd>
      </div>
    </div>
  );
}
