"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  BadgeCheck,
  CalendarClock,
  CircleAlert,
  CircleCheck,
  Clock3,
  Inbox,
  Phone,
  ScanLine,
  ShieldX,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import { useProviderArrivals, useVerifyProviderCheckIn } from "@/hooks/useProviderCheckIn";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { dateFnsLocale } from "@/lib/format/datetime";
import { localizedName } from "@/lib/i18n/localized";
import type { ProviderCheckInResult, ProviderDeskBooking } from "@/lib/mock/providerCheckIn";
import {
  providerCheckInSchema,
  type ProviderCheckInValues,
} from "@/lib/validation/providerCheckIn";
import { useAuthStore } from "@/store/authStore";

function ResultPanel({
  result,
  locale,
}: {
  result: ProviderCheckInResult;
  locale: Locale;
}): ReactNode {
  const t = useTranslations("provider.checkIn");
  const formatMoney = useFormatSyp();

  if (result.kind === "invalid") {
    return (
      <GlassPanel className="border-destructive/35 bg-destructive/6 items-center px-6 py-10 text-center">
        <span className="bg-destructive/12 text-destructive grid size-14 place-items-center rounded-full">
          <ShieldX className="size-7" aria-hidden />
        </span>
        <h2 className="font-heading text-prose mt-4 text-2xl font-semibold">
          {t("invalid.title")}
        </h2>
        <p className="text-prose-muted mt-2 max-w-md text-sm leading-7">
          {t("invalid.description")}
        </p>
      </GlassPanel>
    );
  }

  const booking = result.booking;
  const success = result.kind === "success";
  return (
    <GlassPanel
      className={cn("border-primary/35 p-0", !success && "border-warning/40 bg-warning/6")}
    >
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "grid size-12 shrink-0 place-items-center rounded-full",
              success ? "bg-primary/12 text-primary" : "bg-warning/15 text-warning",
            )}
          >
            {success ? (
              <CircleCheck className="size-6" aria-hidden />
            ) : (
              <CircleAlert className="size-6" aria-hidden />
            )}
          </span>
          <div>
            <p className="text-primary text-xs font-bold uppercase tracking-[0.14em]">
              {success ? t("success.eyebrow") : t("alreadyUsed.eyebrow")}
            </p>
            <h2 className="font-heading text-prose mt-1 text-2xl font-semibold">
              {success ? t("success.title") : t("alreadyUsed.title")}
            </h2>
            <p className="text-prose-muted mt-1 text-sm">
              {success ? t("success.description") : t("alreadyUsed.description")}
            </p>
          </div>
        </div>
        <Badge variant={success ? "solid" : "outline"}>{booking.reference}</Badge>
      </div>

      <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
        <div className="space-y-4">
          <Detail
            icon={UserRound}
            label={t("result.guest")}
            value={localizedName(booking.guestName, locale)}
          />
          <Detail icon={Phone} label={t("result.phone")} value={booking.phone} dir="ltr" />
          <Detail
            icon={UsersRound}
            label={t("result.party")}
            value={t("party", { count: booking.partySize })}
          />
          <Detail
            icon={CalendarClock}
            label={t("result.schedule")}
            value={format(new Date(booking.schedule), "PPp", { locale: dateFnsLocale(locale) })}
          />
        </div>
        <div className="bg-glass-control rounded-2xl p-5">
          <p className="text-prose-muted text-xs font-semibold uppercase tracking-wide">
            {t("result.collectCash")}
          </p>
          <p className="font-heading text-prose mt-2 text-2xl font-semibold">
            {formatMoney(booking.cashDueSyp)}
          </p>
          {booking.discountSyp > 0 ? (
            <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-prose-muted">{t("result.listPrice")}</dt>
                <dd className="text-prose">{formatMoney(booking.listPriceSyp)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-prose-muted">
                  {t("result.discount", { code: booking.couponCode ?? "" })}
                </dt>
                <dd className="text-primary">−{formatMoney(booking.discountSyp)}</dd>
              </div>
            </dl>
          ) : null}
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-prose-muted flex items-center gap-2 text-xs">
              <Clock3 className="size-3.5" aria-hidden />
              {success ? t("result.checkedNow") : t("result.checkedAt")}
            </p>
            <p className="text-prose mt-1 text-sm font-semibold">
              {booking.checkedInAt
                ? format(new Date(booking.checkedInAt), "PPp", { locale: dateFnsLocale(locale) })
                : "—"}
            </p>
            <p className="text-prose-muted mt-1 text-xs">
              {t("result.byStaff", { staff: booking.checkedInBy ?? t("result.unknownStaff") })}
            </p>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
  dir,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
}): ReactNode {
  return (
    <div className="flex items-start gap-3">
      <span className="bg-option-hover text-primary grid size-9 shrink-0 place-items-center rounded-xl">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-prose-muted text-xs">{label}</p>
        <p className="text-prose mt-1 truncate text-sm font-semibold" dir={dir}>
          {value}
        </p>
      </div>
    </div>
  );
}

export function ProviderCheckInScreen({ initialCode = "" }: { initialCode?: string }): ReactNode {
  const t = useTranslations("provider.checkIn");
  const tUi = useTranslations("ui");
  const rawLocale = useLocale();
  const locale: Locale = rawLocale === "ar" ? "ar" : "en";
  const user = useAuthStore((state) => state.user);
  const arrivals = useProviderArrivals();
  const verify = useVerifyProviderCheckIn();
  const form = useForm<ProviderCheckInValues>({
    resolver: zodResolver(providerCheckInSchema),
    defaultValues: { code: initialCode },
  });

  function verifyCode(code: string): void {
    verify.reset();
    verify.mutate({ code, staffName: user.name });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(24rem,1.15fr)]">
        <GlassPanel className="p-6 sm:p-8">
          <span className="bg-primary/12 text-primary grid size-12 place-items-center rounded-2xl">
            <ScanLine className="size-6" aria-hidden />
          </span>
          <h2 className="font-heading text-prose mt-5 text-2xl font-semibold">{t("form.title")}</h2>
          <p className="text-prose-muted mt-2 text-sm leading-7">{t("form.description")}</p>
          <form className="mt-6" onSubmit={form.handleSubmit(({ code }) => verifyCode(code))}>
            <Input
              variant="glass"
              maxLength={6}
              autoComplete="off"
              spellCheck={false}
              inputMode="text"
              dir="ltr"
              label={t("form.codeLabel")}
              placeholder="ABC123"
              className="h-16 text-center font-mono text-2xl font-bold uppercase tracking-[0.28em]"
              {...form.register("code", {
                onChange: (event) => {
                  event.target.value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                  verify.reset();
                },
              })}
            />
            {form.formState.errors.code ? (
              <p className="text-destructive mt-2 text-xs">{t("form.codeError")}</p>
            ) : null}
            <Button
              type="submit"
              className="mt-4 w-full justify-center"
              disabled={verify.isPending}
            >
              {verify.isPending ? t("form.verifying") : t("form.verify")}
            </Button>
          </form>
          <p className="text-prose-muted mt-4 text-center text-xs">{t("form.demoHint")}</p>
        </GlassPanel>

        {verify.data ? (
          <ResultPanel result={verify.data} locale={locale} />
        ) : verify.isError ? (
          <ErrorState
            title={tUi("errorTitle")}
            description={tUi("errorDescription")}
            retryLabel={tUi("retry")}
            onRetry={() => {
              void form.handleSubmit(({ code }) => verifyCode(code))();
            }}
          />
        ) : (
          <GlassPanel className="items-center justify-center px-6 py-16 text-center">
            <BadgeCheck className="text-primary size-10" aria-hidden />
            <h2 className="font-heading text-prose mt-4 text-xl font-semibold">
              {t("ready.title")}
            </h2>
            <p className="text-prose-muted mt-2 max-w-md text-sm leading-7">
              {t("ready.description")}
            </p>
          </GlassPanel>
        )}
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-prose text-2xl font-semibold">{t("arrivals.title")}</h2>
          <p className="text-prose-muted mt-1 text-sm">{t("arrivals.description")}</p>
        </div>
        {arrivals.isPending ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
          </div>
        ) : null}
        {arrivals.isError ? (
          <ErrorState
            title={tUi("errorTitle")}
            description={tUi("errorDescription")}
            retryLabel={tUi("retry")}
            onRetry={() => void arrivals.refetch()}
          />
        ) : null}
        {arrivals.data?.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={t("arrivals.emptyTitle")}
            description={t("arrivals.emptyDescription")}
          />
        ) : null}
        {arrivals.data?.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {arrivals.data.map((booking) => (
              <ArrivalCard
                key={booking.id}
                booking={booking}
                locale={locale}
                pending={verify.isPending}
                onVerify={() => {
                  form.setValue("code", booking.backupCode, { shouldValidate: true });
                  verifyCode(booking.backupCode);
                }}
              />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function ArrivalCard({
  booking,
  locale,
  pending,
  onVerify,
}: {
  booking: ProviderDeskBooking;
  locale: Locale;
  pending: boolean;
  onVerify: () => void;
}): ReactNode {
  const t = useTranslations("provider.checkIn");
  const formatMoney = useFormatSyp();
  return (
    <GlassPanel className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-prose truncate font-semibold">
            {localizedName(booking.guestName, locale)}
          </p>
          <p className="text-prose-muted mt-1 text-xs">
            {booking.reference} · {t(`categories.${booking.category}`)}
          </p>
        </div>
        <Badge>{format(new Date(booking.schedule), "p", { locale: dateFnsLocale(locale) })}</Badge>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 border-y border-border py-4">
        <div>
          <p className="text-prose-muted text-xs">{t("result.party")}</p>
          <p className="text-prose mt-1 text-sm font-semibold">
            {t("party", { count: booking.partySize })}
          </p>
        </div>
        <div className="text-end">
          <p className="text-prose-muted text-xs">{t("result.collectCash")}</p>
          <p className="text-prose mt-1 text-sm font-semibold">{formatMoney(booking.cashDueSyp)}</p>
        </div>
      </div>
      <Button
        className="mt-4 w-full justify-center"
        size="sm"
        onClick={onVerify}
        disabled={pending}
      >
        {t("arrivals.checkIn")}
      </Button>
    </GlassPanel>
  );
}
