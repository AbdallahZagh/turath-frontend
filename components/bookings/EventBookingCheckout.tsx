"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, CalendarHeart, Clock3, Tag, Ticket, Users } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Controller, useForm, useWatch, type FieldError } from "react-hook-form";

import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { BookingCouponFeedback } from "@/components/bookings/BookingCouponFeedback";
import { BookingPolicyNote } from "@/components/bookings/BookingPolicyNote";
import { BookingReliabilityNotice } from "@/components/bookings/BookingReliabilityNotice";
import {
  BookingConfirmBar,
  BookingSummaryCard,
  CHECKOUT_GRID,
} from "@/components/bookings/BookingSummaryCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Stepper } from "@/components/ui/Stepper";
import { useBookingPaths } from "@/hooks/useBookingPaths";
import { useCreateEventBooking, useValidateBookingCoupon } from "@/hooks/useBookings";
import { useEvent } from "@/hooks/useEvents";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import type { Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/translations";
import { formatDateAndPickerTime, formatMediumDate, formatPickerTime } from "@/lib/format/datetime";
import { formatCount } from "@/lib/format/number";
import { partSeparator } from "@/lib/format/separators";
import { localizedName } from "@/lib/i18n/localized";
import { calculateCouponDiscountSyp, type CouponResult } from "@/lib/mock/bookings";
import {
  eventBookingSchema,
  isEventBookingErrorKey,
  type EventBookingErrorKey,
  type EventBookingValues,
} from "@/lib/validation/booking";
import { toast } from "@/store/toastStore";

function message(
  t: (key: EventBookingErrorKey) => string,
  error: FieldError | undefined,
): string | undefined {
  if (!error?.message) return undefined;
  return isEventBookingErrorKey(error.message) ? t(error.message) : error.message;
}

export function EventBookingCheckout({
  eventId,
  initialSessionId,
  initialQuantity,
}: {
  eventId: string;
  initialSessionId?: string;
  initialQuantity: number;
}): ReactNode {
  const t = useTranslations("eventBooking");
  const te = useTranslations("eventBooking.errors");
  const tt = useTranslations("events.tiers");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const router = useRouter();
  const paths = useBookingPaths();
  const formatMoney = useFormatSyp();
  const eventQuery = useEvent(eventId);
  const createBooking = useCreateEventBooking();
  const couponMutation = useValidateBookingCoupon();
  const [coupon, setCoupon] = useState<CouponResult | null>(null);
  const form = useForm<EventBookingValues>({
    resolver: zodResolver(eventBookingSchema),
    defaultValues: {
      sessionId: initialSessionId ?? "",
      ticketTier: undefined,
      quantity: initialQuantity,
      couponCode: "",
    },
  });
  const sessionId = useWatch({ control: form.control, name: "sessionId" });
  const ticketTier = useWatch({ control: form.control, name: "ticketTier" });
  const quantity = useWatch({ control: form.control, name: "quantity" });
  const couponCode = useWatch({ control: form.control, name: "couponCode" });
  const event = eventQuery.data;
  const session = event?.sessions.find((item) => item.id === sessionId);
  const tier = session?.tiers.find((item) => item.id === ticketTier);
  const listPriceSyp = (tier?.priceSyp ?? 0) * quantity;
  const activeCoupon = coupon?.valid ? coupon : null;
  const discountSyp = calculateCouponDiscountSyp(activeCoupon, listPriceSyp);
  const cashDueSyp = Math.max(0, listPriceSyp - discountSyp);
  const priceReady = Boolean(session && tier);
  const price = (amountSyp: number): string => (priceReady ? formatMoney(amountSyp) : "—");

  if (eventQuery.isPending)
    return (
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <Skeleton className="h-[40rem]" />
        <Skeleton className="h-96" />
      </div>
    );
  if (eventQuery.isError)
    return (
      <ErrorState
        title={t("states.loadErrorTitle")}
        description={t("states.loadErrorBody")}
        retryLabel={t("states.retry")}
        onRetry={() => void eventQuery.refetch()}
      />
    );
  if (!event)
    return (
      <EmptyState
        icon={CalendarHeart}
        title={t("states.unavailableTitle")}
        description={t("states.unavailableBody")}
        action={
          <Button href={paths.catalog("events")} variant="outline">
            {t("backToEvents")}
          </Button>
        }
      />
    );
  const availableEvent = event;
  const sessions: SelectOption[] = availableEvent.sessions.map((item) => ({
    value: item.id,
    label: formatMediumDate(item.date, loc),
    hint: `${formatPickerTime(item.startsAt, loc)}–${formatPickerTime(item.endsAt, loc)}`,
  }));
  const tiers: SelectOption[] = (session?.tiers ?? []).map((item) => ({
    value: item.id,
    label: tt(item.id),
    hint: `${formatMoney(item.priceSyp)}${partSeparator(loc)}${t("remaining", { count: item.remaining })}`,
    disabled: item.remaining < quantity,
  }));

  async function applyCoupon(): Promise<void> {
    setCoupon(
      await couponMutation.mutateAsync({
        code: couponCode,
        bookingType: "event",
        listingId: availableEvent.id,
      }),
    );
  }
  async function onSubmit(values: EventBookingValues): Promise<void> {
    const selectedSession = availableEvent.sessions.find((item) => item.id === values.sessionId);
    const selectedTier = selectedSession?.tiers.find((item) => item.id === values.ticketTier);
    if (!selectedSession) {
      form.setError("sessionId", { message: "sessionRequired" });
      return;
    }
    if (!selectedTier) {
      form.setError("ticketTier", { message: "tierRequired" });
      return;
    }
    if (selectedTier.remaining < values.quantity) {
      form.setError("quantity", { message: "quantityMax" });
      return;
    }
    try {
      const booking = await createBooking.mutateAsync({
        eventId: availableEvent.id,
        sessionId: selectedSession.id,
        ticketTier: selectedTier.id,
        quantity: values.quantity,
        date: selectedSession.date,
        startsAt: selectedSession.startsAt,
        listPriceSyp,
        discountSyp,
        cashDueSyp,
        couponCode: activeCoupon?.code ?? null,
      });
      router.push(paths.voucher(booking.id));
    } catch {
      toast.error(t("toastErrorTitle"), t("toastErrorBody"));
    }
  }

  const confirm = {
    label: createBooking.isPending ? t("confirming") : t("confirm"),
    disabled: createBooking.isPending || !session || !tier || tier.remaining < quantity,
    onClick: () => void form.handleSubmit(onSubmit)(),
  };

  return (
    <div className={CHECKOUT_GRID}>
      <GlassPanel className="p-6 sm:p-8 lg:p-9">
        <form className="space-y-7" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <section>
            <h2 className="font-heading text-prose text-xl font-semibold">{t("ticketDetails")}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Controller
                  control={form.control}
                  name="sessionId"
                  render={({ field }) => (
                    <Select
                      variant="main"
                      required
                      label={t("session")}
                      placeholder={t("sessionPlaceholder")}
                      options={sessions}
                      value={field.value}
                      onChange={field.onChange}
                      icon={<CalendarDays className="size-4" />}
                    />
                  )}
                />
                <AuthFieldError message={message(te, form.formState.errors.sessionId)} />
              </div>
              <div className="space-y-1.5">
                <Controller
                  control={form.control}
                  name="ticketTier"
                  render={({ field }) => (
                    <Select
                      variant="main"
                      required
                      disabled={!session}
                      label={t("tier")}
                      placeholder={t("tierPlaceholder")}
                      options={tiers}
                      value={field.value}
                      onChange={field.onChange}
                      icon={<Ticket className="size-4" />}
                    />
                  )}
                />
                <AuthFieldError message={message(te, form.formState.errors.ticketTier)} />
              </div>
              <div className="space-y-1.5">
                <Controller
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <Stepper
                      variant="main"
                      required
                      label={t("quantity")}
                      min={1}
                      max={Math.min(6, tier?.remaining ?? 6)}
                      value={field.value}
                      onChange={field.onChange}
                      icon={<Users className="size-4" />}
                    />
                  )}
                />
                <AuthFieldError message={message(te, form.formState.errors.quantity)} />
              </div>
            </div>
          </section>
          <section className="bg-glass-control rounded-2xl p-5">
            <div className="flex gap-3">
              <Clock3 className="text-accent mt-0.5 size-5 shrink-0" aria-hidden />
              <div>
                <h2 className="text-prose font-semibold">{t("holdTitle")}</h2>
                <p className="text-prose-muted mt-1 text-sm leading-relaxed">{t("holdBody")}</p>
              </div>
            </div>
          </section>
          <BookingReliabilityNotice />

          <BookingPolicyNote />
          <section>
            <h2 className="font-heading text-prose text-xl font-semibold">{t("discountTitle")}</h2>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Input
                variant="main"
                label={t("discountCode")}
                placeholder={t("discountPlaceholder")}
                className="flex-1"
                {...form.register("couponCode", { onChange: () => setCoupon(null) })}
              />
              <Button
                type="button"
                variant="outline"
                disabled={couponMutation.isPending || !couponCode.trim()}
                onClick={() => void applyCoupon()}
              >
                <Tag className="size-4" aria-hidden />
                {couponMutation.isPending ? t("applying") : t("apply")}
              </Button>
            </div>
            <BookingCouponFeedback coupon={coupon} formatMoney={formatMoney} />
          </section>
        </form>
      </GlassPanel>
      <BookingSummaryCard
        icon={CalendarDays}
        title={localizedName(event.name, loc)}
        subtitle={localizedName(event.venue, loc)}
        rows={[
          {
            id: "session",
            label: t("session"),
            icon: Clock3,
            value: session
              ? formatDateAndPickerTime(session.date, session.startsAt, loc)
              : t("notSelected"),
          },
          {
            id: "tier",
            label: t("tier"),
            icon: Ticket,
            value: tier ? tt(tier.id) : t("notSelected"),
          },
          { id: "quantity", label: t("quantity"), icon: Users, value: formatCount(quantity, loc) },
        ]}
        listPrice={{ label: t("listPrice"), value: price(listPriceSyp) }}
        discount={
          discountSyp > 0 ? { label: t("discount"), value: `− ${formatMoney(discountSyp)}` } : null
        }
        cashDue={{ label: t("cashDue"), value: price(cashDueSyp) }}
        priceHint={priceReady ? null : t("chooseTierForPrice")}
        cashDueHint={t("cashDueHint")}
        confirm={confirm}
        back={{ href: paths.listing("events", event.id), label: t("backToEvent") }}
      />
      <BookingConfirmBar
        cashDue={{ label: t("cashDue"), value: price(cashDueSyp) }}
        priceHint={priceReady ? null : t("chooseTierForPrice")}
        confirm={confirm}
      />
    </div>
  );
}
