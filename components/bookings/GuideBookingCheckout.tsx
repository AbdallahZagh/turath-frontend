"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Clock3, Landmark, Languages, Sparkles, UserRoundSearch } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Controller, useForm, useWatch, type FieldError } from "react-hook-form";

import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { BookingCouponFeedback } from "@/components/bookings/BookingCouponFeedback";
import { BookingCouponField } from "@/components/bookings/BookingCouponField";
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
import { DatePicker } from "@/components/ui/DatePicker";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Stepper } from "@/components/ui/Stepper";
import { useBookingPaths } from "@/hooks/useBookingPaths";
import { useCreateGuideBooking, useValidateBookingCoupon } from "@/hooks/useBookings";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import { useGuide } from "@/hooks/useGuides";
import type { Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/translations";
import { formatMediumDate } from "@/lib/format/datetime";
import { localizedName } from "@/lib/i18n/localized";
import { calculateCouponDiscountSyp, type CouponResult } from "@/lib/mock/bookings";
import {
  guideBookingSchema,
  isGuideBookingErrorKey,
  type GuideBookingErrorKey,
  type GuideBookingValues,
} from "@/lib/validation/booking";
import { toast } from "@/store/toastStore";

function errorMessage(
  t: (key: GuideBookingErrorKey) => string,
  error: FieldError | undefined,
): string | undefined {
  if (!error?.message) return undefined;
  return isGuideBookingErrorKey(error.message) ? t(error.message) : error.message;
}

export function GuideBookingCheckout({
  guideId,
  initialDate,
}: {
  guideId: string;
  initialDate?: string;
}): ReactNode {
  const t = useTranslations("guideBooking");
  const te = useTranslations("guideBooking.errors");
  const tg = useTranslations("guides");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const router = useRouter();
  const paths = useBookingPaths();
  const formatMoney = useFormatSyp();
  const guideQuery = useGuide(guideId);
  const createBooking = useCreateGuideBooking();
  const couponMutation = useValidateBookingCoupon();
  const [coupon, setCoupon] = useState<CouponResult | null>(null);
  const form = useForm<GuideBookingValues>({
    resolver: zodResolver(guideBookingSchema),
    defaultValues: {
      date: initialDate ?? "",
      duration: undefined,
      hours: 2,
      language: undefined,
      focusArea: undefined,
      couponCode: "",
    },
  });
  const pickedDate = useWatch({ control: form.control, name: "date" });
  const duration = useWatch({ control: form.control, name: "duration" });
  const hours = useWatch({ control: form.control, name: "hours" });
  const language = useWatch({ control: form.control, name: "language" });
  const focusArea = useWatch({ control: form.control, name: "focusArea" });
  const couponCode = useWatch({ control: form.control, name: "couponCode" });
  const guide = guideQuery.data;
  // A carried or typed date the guide is not available on is dropped, never booked.
  const date = guide?.availability.includes(pickedDate) ? pickedDate : "";
  const listPriceSyp =
    guide && duration
      ? duration === "hourly"
        ? guide.rates.hourly * hours
        : guide.rates[duration]
      : 0;
  const price = (amountSyp: number): string => (duration ? formatMoney(amountSyp) : "—");
  const priceHint = duration ? null : t("chooseDurationForPrice");
  const activeCoupon = coupon?.valid ? coupon : null;
  const discountSyp = calculateCouponDiscountSyp(activeCoupon, listPriceSyp);
  const cashDueSyp = listPriceSyp - discountSyp;
  if (guideQuery.isPending)
    return (
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <Skeleton className="h-[40rem]" />
        <Skeleton className="h-96" />
      </div>
    );
  if (guideQuery.isError)
    return (
      <ErrorState
        title={t("states.loadErrorTitle")}
        description={t("states.loadErrorBody")}
        retryLabel={t("states.retry")}
        onRetry={() => void guideQuery.refetch()}
      />
    );
  if (!guide)
    return (
      <EmptyState
        icon={UserRoundSearch}
        title={t("states.unavailableTitle")}
        description={t("states.unavailableBody")}
        action={
          <Button href={paths.catalog("guides")} variant="outline">
            {t("backToGuides")}
          </Button>
        }
      />
    );
  const availableGuide = guide;
  const availableDates = [...guide.availability].sort();
  const urlDateUnavailable = Boolean(initialDate) && pickedDate === initialDate && !date;
  const durations: SelectOption[] = (["hourly", "halfDay", "fullDay"] as const).map((value) => ({
    value,
    label: tg(`durations.${value}`),
    hint: formatMoney(guide.rates[value]),
  }));
  const languages: SelectOption[] = guide.languages.map((value) => ({
    value,
    label: tg(`languages.${value}`),
  }));
  const focuses: SelectOption[] = guide.specialties.map((value) => ({
    value,
    label: tg(`specialties.${value}`),
  }));
  async function applyCoupon(): Promise<void> {
    setCoupon(
      await couponMutation.mutateAsync({
        code: couponCode,
        bookingType: "guide",
        listingId: availableGuide.id,
      }),
    );
  }
  async function onSubmit(values: GuideBookingValues): Promise<void> {
    if (!availableGuide.availability.includes(values.date)) {
      form.setError("date", { message: "dateRequired" });
      return;
    }
    try {
      const booking = await createBooking.mutateAsync({
        guideId: availableGuide.id,
        date: values.date,
        duration: values.duration,
        hours: values.duration === "hourly" ? values.hours : values.duration === "halfDay" ? 4 : 8,
        language: values.language,
        focusArea: values.focusArea,
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
    disabled: createBooking.isPending || !date || !duration || !language || !focusArea,
    onClick: () => void form.handleSubmit(onSubmit)(),
  };

  return (
    <div className={CHECKOUT_GRID}>
      <GlassPanel className="p-6 sm:p-8 lg:p-9">
        <form className="space-y-7" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <section>
            <h2 className="font-heading text-prose text-xl font-semibold">{t("details")}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Controller
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <DatePicker
                      variant="main"
                      required
                      label={t("date")}
                      placeholder={t("datePlaceholder")}
                      min={availableDates[0]}
                      max={availableDates.at(-1)}
                      centerOn={availableDates[0]}
                      availableDates={availableDates}
                      showToday={false}
                      value={date}
                      onChange={field.onChange}
                    />
                  )}
                />
                {urlDateUnavailable && !form.formState.errors.date ? (
                  <p className="text-prose-muted text-xs">{t("dateUnavailable")}</p>
                ) : null}
                <AuthFieldError message={errorMessage(te, form.formState.errors.date)} />
              </div>
              <div className="space-y-1.5">
                <Controller
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <Select
                      variant="main"
                      required
                      label={t("duration")}
                      placeholder={t("durationPlaceholder")}
                      options={durations}
                      value={field.value}
                      onChange={field.onChange}
                      icon={<Clock3 className="size-4" />}
                    />
                  )}
                />
                <AuthFieldError message={errorMessage(te, form.formState.errors.duration)} />
              </div>
              {duration === "hourly" ? (
                <div className="space-y-1.5">
                  <Controller
                    control={form.control}
                    name="hours"
                    render={({ field }) => (
                      <Stepper
                        variant="main"
                        required
                        label={t("hours")}
                        min={1}
                        max={8}
                        value={field.value}
                        onChange={field.onChange}
                        icon={<Clock3 className="size-4" />}
                      />
                    )}
                  />
                  <AuthFieldError message={errorMessage(te, form.formState.errors.hours)} />
                </div>
              ) : null}
              <div className="space-y-1.5">
                <Controller
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <Select
                      variant="main"
                      required
                      label={t("language")}
                      placeholder={t("languagePlaceholder")}
                      options={languages}
                      value={field.value}
                      onChange={field.onChange}
                      icon={<Languages className="size-4" />}
                    />
                  )}
                />
                <AuthFieldError message={errorMessage(te, form.formState.errors.language)} />
              </div>
              <div className="space-y-1.5">
                <Controller
                  control={form.control}
                  name="focusArea"
                  render={({ field }) => (
                    <Select
                      variant="main"
                      required
                      label={t("focusArea")}
                      placeholder={t("focusPlaceholder")}
                      options={focuses}
                      value={field.value}
                      onChange={field.onChange}
                      icon={<Sparkles className="size-4" />}
                    />
                  )}
                />
                <AuthFieldError message={errorMessage(te, form.formState.errors.focusArea)} />
              </div>
            </div>
          </section>
          <section className="bg-glass-control rounded-2xl p-5">
            <div className="flex gap-3">
              <Clock3 className="text-accent mt-0.5 size-5 shrink-0" aria-hidden />
              <div>
                <h2 className="text-prose font-semibold">{t("holdTitle")}</h2>
                <p className="text-prose-muted mt-1 text-sm">{t("holdBody")}</p>
              </div>
            </div>
          </section>
          <BookingReliabilityNotice />

          <BookingPolicyNote />
          <section>
            <h2 className="font-heading text-prose text-xl font-semibold">{t("discountTitle")}</h2>
            <BookingCouponField
              label={t("discountCode")}
              placeholder={t("discountPlaceholder")}
              applyLabel={couponMutation.isPending ? t("applying") : t("apply")}
              disabled={couponMutation.isPending || !couponCode.trim()}
              onApply={() => void applyCoupon()}
              field={form.register("couponCode", { onChange: () => setCoupon(null) })}
            />
            <BookingCouponFeedback coupon={coupon} formatMoney={formatMoney} />
          </section>
        </form>
      </GlassPanel>
      <BookingSummaryCard
        icon={Languages}
        title={localizedName(guide.name, loc)}
        subtitle={localizedName(guide.address, loc)}
        rows={[
          {
            id: "date",
            label: t("date"),
            icon: CalendarDays,
            value: date ? formatMediumDate(date, loc) : t("notSelected"),
          },
          {
            id: "duration",
            label: t("duration"),
            icon: Clock3,
            value: duration ? tg(`durations.${duration}`) : t("notSelected"),
          },
          {
            id: "language",
            label: t("language"),
            icon: Languages,
            value: language ? tg(`languages.${language}`) : t("notSelected"),
          },
          {
            id: "focus",
            label: t("focusArea"),
            icon: Landmark,
            value: focusArea ? tg(`specialties.${focusArea}`) : t("notSelected"),
          },
        ]}
        listPrice={{ label: t("listPrice"), value: price(listPriceSyp) }}
        discount={
          discountSyp > 0 ? { label: t("discount"), value: `− ${formatMoney(discountSyp)}` } : null
        }
        cashDue={{ label: t("cashDue"), value: price(cashDueSyp) }}
        priceHint={priceHint}
        cashDueHint={t("cashDueHint")}
        confirm={confirm}
        back={{ href: paths.listing("guides", guide.id), label: t("backToGuide") }}
      />
      <BookingConfirmBar
        cashDue={{ label: t("cashDue"), value: price(cashDueSyp) }}
        priceHint={priceHint}
        confirm={confirm}
      />
    </div>
  );
}
