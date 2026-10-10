"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Armchair, CalendarDays, Clock3, MapPin, Users, UtensilsCrossed } from "lucide-react";
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
import { DatePicker } from "@/components/ui/DatePicker";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Stepper } from "@/components/ui/Stepper";
import { Textarea } from "@/components/ui/Textarea";
import { useBookingPaths } from "@/hooks/useBookingPaths";
import { useCreateRestaurantBooking, useValidateBookingCoupon } from "@/hooks/useBookings";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import { useRestaurant } from "@/hooks/useRestaurants";
import type { Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/translations";
import { formatMediumDate, formatPickerTime, toIsoDate } from "@/lib/format/datetime";
import { formatCount } from "@/lib/format/number";
import { localizedName } from "@/lib/i18n/localized";
import { calculateCouponDiscountSyp, type CouponResult } from "@/lib/mock/bookings";
import {
  isRestaurantBookingErrorKey,
  restaurantBookingSchema,
  type RestaurantBookingErrorKey,
  type RestaurantBookingValues,
} from "@/lib/validation/booking";
import { toast } from "@/store/toastStore";

function message(
  t: (key: RestaurantBookingErrorKey) => string,
  error: FieldError | undefined,
): string | undefined {
  if (!error?.message) return undefined;
  return isRestaurantBookingErrorKey(error.message) ? t(error.message) : error.message;
}

export function RestaurantBookingCheckout({
  restaurantId,
  initialDate,
  initialTime,
  initialPartySize,
}: {
  restaurantId: string;
  initialDate?: string;
  initialTime?: string;
  initialPartySize: number;
}): ReactNode {
  const t = useTranslations("restaurantBooking");
  const te = useTranslations("restaurantBooking.errors");
  const tz = useTranslations("restaurants.zones");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const router = useRouter();
  const paths = useBookingPaths();
  const formatMoney = useFormatSyp();
  const restaurantQuery = useRestaurant(restaurantId);
  const createBooking = useCreateRestaurantBooking();
  const couponMutation = useValidateBookingCoupon();
  const [coupon, setCoupon] = useState<CouponResult | null>(null);
  const today = toIsoDate(new Date());
  const form = useForm<RestaurantBookingValues>({
    resolver: zodResolver(restaurantBookingSchema),
    defaultValues: {
      date: initialDate ?? today,
      timeSlot: initialTime ?? "",
      zoneId: undefined,
      partySize: initialPartySize,
      specialRequests: "",
      couponCode: "",
    },
  });
  const date = useWatch({ control: form.control, name: "date" });
  const timeSlot = useWatch({ control: form.control, name: "timeSlot" });
  const zoneId = useWatch({ control: form.control, name: "zoneId" });
  const partySize = useWatch({ control: form.control, name: "partySize" });
  const couponCode = useWatch({ control: form.control, name: "couponCode" });
  const restaurant = restaurantQuery.data;
  const selectedZone = restaurant?.zones.find((zone) => zone.id === zoneId);
  const listPriceSyp = (selectedZone?.pricePerGuestSyp ?? 0) * partySize;
  const activeCoupon = coupon?.valid ? coupon : null;
  const discountSyp = calculateCouponDiscountSyp(activeCoupon, listPriceSyp);
  const cashDueSyp = Math.max(0, listPriceSyp - discountSyp);
  const priceReady = Boolean(selectedZone);
  const price = (amountSyp: number): string => (priceReady ? formatMoney(amountSyp) : "—");

  if (restaurantQuery.isPending)
    return (
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <Skeleton className="h-[42rem]" />
        <Skeleton className="h-96" />
      </div>
    );
  if (restaurantQuery.isError)
    return (
      <ErrorState
        title={t("states.loadErrorTitle")}
        description={t("states.loadErrorBody")}
        retryLabel={t("states.retry")}
        onRetry={() => void restaurantQuery.refetch()}
      />
    );
  if (!restaurant)
    return (
      <EmptyState
        icon={UtensilsCrossed}
        title={t("states.unavailableTitle")}
        description={t("states.unavailableBody")}
        action={
          <Button href={paths.catalog("restaurants")} variant="outline">
            {t("backToRestaurants")}
          </Button>
        }
      />
    );
  const availableRestaurant = restaurant;

  const zones: SelectOption[] = availableRestaurant.zones.map((zone) => ({
    value: zone.id,
    label: tz(zone.id),
    hint: formatMoney(zone.pricePerGuestSyp),
    disabled: zone.capacity < partySize,
  }));
  const slots: SelectOption[] = availableRestaurant.timeSlots.map((slot) => ({
    value: slot,
    label: formatPickerTime(slot, loc),
  }));

  async function applyCoupon(): Promise<void> {
    setCoupon(
      await couponMutation.mutateAsync({
        code: couponCode,
        bookingType: "restaurant",
        listingId: availableRestaurant.id,
      }),
    );
  }
  async function onSubmit(values: RestaurantBookingValues): Promise<void> {
    const zone = availableRestaurant.zones.find((item) => item.id === values.zoneId);
    if (!availableRestaurant.timeSlots.includes(values.timeSlot)) {
      form.setError("timeSlot", { message: "timeRequired" });
      return;
    }
    if (!zone || zone.capacity < values.partySize) {
      form.setError("zoneId", { message: "zoneRequired" });
      return;
    }
    try {
      const booking = await createBooking.mutateAsync({
        restaurantId: availableRestaurant.id,
        date: values.date,
        timeSlot: values.timeSlot,
        partySize: values.partySize,
        zoneId: values.zoneId,
        specialRequests: values.specialRequests,
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
    disabled: createBooking.isPending || !selectedZone || !timeSlot,
    onClick: () => void form.handleSubmit(onSubmit)(),
  };

  return (
    <div className={CHECKOUT_GRID}>
      <GlassPanel className="p-6 sm:p-8 lg:p-9">
        <form className="space-y-7" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <section>
            <h2 className="font-heading text-prose text-xl font-semibold">
              {t("reservationDetails")}
            </h2>
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
                      min={today}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <AuthFieldError message={message(te, form.formState.errors.date)} />
              </div>
              <div className="space-y-1.5">
                <Controller
                  control={form.control}
                  name="timeSlot"
                  render={({ field }) => (
                    <Select
                      variant="main"
                      required
                      label={t("time")}
                      placeholder={t("timePlaceholder")}
                      options={slots}
                      value={field.value}
                      onChange={field.onChange}
                      icon={<Clock3 className="size-4" />}
                    />
                  )}
                />
                <AuthFieldError message={message(te, form.formState.errors.timeSlot)} />
              </div>
              <div className="space-y-1.5">
                <Controller
                  control={form.control}
                  name="partySize"
                  render={({ field }) => (
                    <Stepper
                      variant="main"
                      required
                      label={t("partySize")}
                      min={1}
                      max={12}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        if (selectedZone && value > selectedZone.capacity)
                          form.resetField("zoneId");
                      }}
                    />
                  )}
                />
                <AuthFieldError message={message(te, form.formState.errors.partySize)} />
              </div>
              <div className="space-y-1.5">
                <Controller
                  control={form.control}
                  name="zoneId"
                  render={({ field }) => (
                    <Select
                      variant="main"
                      required
                      label={t("zone")}
                      placeholder={t("zonePlaceholder")}
                      options={zones}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      icon={<MapPin className="size-4" />}
                    />
                  )}
                />
                <AuthFieldError message={message(te, form.formState.errors.zoneId)} />
              </div>
            </div>
          </section>
          <section>
            <h2 className="font-heading text-prose text-xl font-semibold">{t("requestsTitle")}</h2>
            <p className="text-prose-muted mt-1 text-sm">{t("requestsHint")}</p>
            <div className="mt-4 space-y-1.5">
              <Textarea
                variant="main"
                label={t("specialRequests")}
                placeholder={t("specialRequestsPlaceholder")}
                rows={4}
                {...form.register("specialRequests")}
              />
              <AuthFieldError message={message(te, form.formState.errors.specialRequests)} />
            </div>
          </section>
          <section>
            <h2 className="font-heading text-prose text-xl font-semibold">{t("discountTitle")}</h2>
            <BookingCouponField
              label={t("discountCode")}
              placeholder={t("discountPlaceholder")}
              applyLabel={couponMutation.isPending ? t("applying") : t("apply")}
              disabled={!couponCode.trim() || couponMutation.isPending}
              onApply={() => void applyCoupon()}
              field={form.register("couponCode", { onChange: () => setCoupon(null) })}
            />
            <BookingCouponFeedback coupon={coupon} formatMoney={formatMoney} />
          </section>
          <BookingReliabilityNotice />

          <BookingPolicyNote />
          <div className="bg-glass-control flex gap-3 rounded-2xl p-4 text-sm">
            <Clock3 className="text-accent mt-0.5 size-5 shrink-0" aria-hidden />
            <div>
              <p className="text-prose font-semibold">{t("holdTitle")}</p>
              <p className="text-prose-muted mt-1 leading-relaxed">{t("holdBody")}</p>
            </div>
          </div>
        </form>
      </GlassPanel>
      <BookingSummaryCard
        icon={UtensilsCrossed}
        title={localizedName(restaurant.name, loc)}
        subtitle={localizedName(restaurant.address, loc)}
        rows={[
          {
            id: "date",
            label: t("date"),
            icon: CalendarDays,
            value: date ? formatMediumDate(date, loc) : t("notSelected"),
          },
          {
            id: "time",
            label: t("time"),
            icon: Clock3,
            value: timeSlot ? formatPickerTime(timeSlot, loc) : t("notSelected"),
          },
          { id: "party", label: t("partySize"), icon: Users, value: formatCount(partySize, loc) },
          {
            id: "zone",
            label: t("zone"),
            icon: Armchair,
            value: selectedZone ? tz(selectedZone.id) : t("notSelected"),
          },
        ]}
        listPrice={{ label: t("listPrice"), value: price(listPriceSyp) }}
        discount={
          discountSyp > 0 ? { label: t("discount"), value: `− ${formatMoney(discountSyp)}` } : null
        }
        cashDue={{ label: t("cashDue"), value: price(cashDueSyp) }}
        priceHint={priceReady ? null : t("chooseZoneForPrice")}
        cashDueHint={t("cashDueHint")}
        confirm={confirm}
        back={{ href: paths.listing("restaurants", restaurant.id), label: t("backToRestaurant") }}
      />
      <BookingConfirmBar
        cashDue={{ label: t("cashDue"), value: price(cashDueSyp) }}
        priceHint={priceReady ? null : t("chooseZoneForPrice")}
        confirm={confirm}
      />
    </div>
  );
}
