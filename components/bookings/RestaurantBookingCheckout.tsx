"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarDays, Clock3, MapPin, ShieldCheck, Tag, UtensilsCrossed, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Controller, useForm, useWatch, type FieldError } from "react-hook-form";

import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { BookingCouponFeedback } from "@/components/bookings/BookingCouponFeedback";
import { BookingReliabilityNotice } from "@/components/bookings/BookingReliabilityNotice";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Stepper } from "@/components/ui/Stepper";
import { Textarea } from "@/components/ui/Textarea";
import { useCreateRestaurantBooking, useValidateBookingCoupon } from "@/hooks/useBookings";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import { useRestaurant } from "@/hooks/useRestaurants";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import { localizedName } from "@/lib/i18n/localized";
import { calculateCouponDiscountSyp, type CouponResult } from "@/lib/mock/bookings";
import { isRestaurantBookingErrorKey, restaurantBookingSchema, type RestaurantBookingErrorKey, type RestaurantBookingValues } from "@/lib/validation/booking";
import { toast } from "@/store/toastStore";

function message(t: (key: RestaurantBookingErrorKey) => string, error: FieldError | undefined): string | undefined {
  if (!error?.message) return undefined;
  return isRestaurantBookingErrorKey(error.message) ? t(error.message) : error.message;
}

export function RestaurantBookingCheckout({ restaurantId, initialPartySize }: { restaurantId: string; initialPartySize: number }): ReactNode {
  const t = useTranslations("restaurantBooking");
  const te = useTranslations("restaurantBooking.errors");
  const tz = useTranslations("restaurants.zones");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const router = useRouter();
  const formatMoney = useFormatSyp();
  const restaurantQuery = useRestaurant(restaurantId);
  const createBooking = useCreateRestaurantBooking();
  const couponMutation = useValidateBookingCoupon();
  const [coupon, setCoupon] = useState<CouponResult | null>(null);
  const today = format(new Date(), "yyyy-MM-dd");
  const form = useForm<RestaurantBookingValues>({ resolver: zodResolver(restaurantBookingSchema), defaultValues: { date: today, timeSlot: "", zoneId: undefined, partySize: initialPartySize, specialRequests: "", couponCode: "" } });
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

  if (restaurantQuery.isPending) return <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_24rem]"><Skeleton className="h-[42rem]" /><Skeleton className="h-96" /></div>;
  if (restaurantQuery.isError) return <ErrorState title={t("states.loadErrorTitle")} description={t("states.loadErrorBody")} retryLabel={t("states.retry")} onRetry={() => void restaurantQuery.refetch()} />;
  if (!restaurant) return <EmptyState icon={UtensilsCrossed} title={t("states.unavailableTitle")} description={t("states.unavailableBody")} action={<Button href="/restaurants" variant="outline">{t("backToRestaurants")}</Button>} />;
  const availableRestaurant = restaurant;

  const zones: SelectOption[] = availableRestaurant.zones.map((zone) => ({ value: zone.id, label: tz(zone.id), hint: formatMoney(zone.pricePerGuestSyp), disabled: zone.capacity < partySize }));
  const slots: SelectOption[] = availableRestaurant.timeSlots.map((slot) => ({ value: slot, label: slot }));

  async function applyCoupon(): Promise<void> {
    setCoupon(await couponMutation.mutateAsync({
      code: couponCode,
      bookingType: "restaurant",
      listingId: availableRestaurant.id,
    }));
  }
  async function onSubmit(values: RestaurantBookingValues): Promise<void> {
    const zone = availableRestaurant.zones.find((item) => item.id === values.zoneId);
    if (!zone || zone.capacity < values.partySize || !availableRestaurant.timeSlots.includes(values.timeSlot)) return;
    try {
      const booking = await createBooking.mutateAsync({ restaurantId: availableRestaurant.id, date: values.date, timeSlot: values.timeSlot, partySize: values.partySize, zoneId: values.zoneId, specialRequests: values.specialRequests, listPriceSyp, discountSyp, cashDueSyp, couponCode: activeCoupon?.code ?? null });
      router.push(`/bookings/${booking.id}`);
    } catch { toast.error(t("toastErrorTitle"), t("toastErrorBody")); }
  }

  return (
    <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <GlassPanel className="p-6 sm:p-8 lg:p-9">
        <div className="border-border border-b pb-6"><p className="text-primary text-sm font-semibold">{t("eyebrow")}</p><h1 className="font-heading text-prose mt-2 text-3xl font-semibold sm:text-4xl">{t("title")}</h1><p className="text-prose-muted mt-2">{localizedName(restaurant.name, loc)}</p></div>
        <form className="mt-7 space-y-7" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <section><h2 className="font-heading text-prose text-xl font-semibold">{t("reservationDetails")}</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Controller control={form.control} name="date" render={({ field }) => <DatePicker variant="main" required label={t("date")} min={today} value={field.value} onChange={field.onChange} />} /><AuthFieldError message={message(te, form.formState.errors.date)} /></div>
            <div className="space-y-1.5"><Controller control={form.control} name="timeSlot" render={({ field }) => <Select variant="main" required label={t("time")} placeholder={t("timePlaceholder")} options={slots} value={field.value} onChange={field.onChange} icon={<Clock3 className="size-4" />} />} /><AuthFieldError message={message(te, form.formState.errors.timeSlot)} /></div>
            <div className="space-y-1.5"><Controller control={form.control} name="partySize" render={({ field }) => <Stepper variant="main" required label={t("partySize")} min={1} max={12} value={field.value} onChange={(value) => { field.onChange(value); if (selectedZone && value > selectedZone.capacity) form.resetField("zoneId"); }} />} /><AuthFieldError message={message(te, form.formState.errors.partySize)} /></div>
            <div className="space-y-1.5"><Controller control={form.control} name="zoneId" render={({ field }) => <Select variant="main" required label={t("zone")} placeholder={t("zonePlaceholder")} options={zones} value={field.value ?? ""} onChange={field.onChange} icon={<MapPin className="size-4" />} />} /><AuthFieldError message={message(te, form.formState.errors.zoneId)} /></div>
          </div></section>
          <section><h2 className="font-heading text-prose text-xl font-semibold">{t("requestsTitle")}</h2><p className="text-prose-muted mt-1 text-sm">{t("requestsHint")}</p><div className="mt-4 space-y-1.5"><Textarea variant="main" label={t("specialRequests")} placeholder={t("specialRequestsPlaceholder")} rows={4} {...form.register("specialRequests")} /><AuthFieldError message={message(te, form.formState.errors.specialRequests)} /></div></section>
          <section><h2 className="font-heading text-prose text-xl font-semibold">{t("discountTitle")}</h2><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start"><Input variant="main" label={t("discountCode")} placeholder={t("discountPlaceholder")} className="flex-1" {...form.register("couponCode", { onChange: () => setCoupon(null) })} /><Button type="button" variant="outline" className="sm:mt-0.5" disabled={!couponCode.trim() || couponMutation.isPending} onClick={() => void applyCoupon()}><Tag className="size-4" aria-hidden />{couponMutation.isPending ? t("applying") : t("apply")}</Button></div><BookingCouponFeedback coupon={coupon} formatMoney={formatMoney} /></section>
          <BookingReliabilityNotice />
          <div className="bg-glass-control flex gap-3 rounded-2xl p-4 text-sm"><Clock3 className="text-accent mt-0.5 size-5 shrink-0" aria-hidden /><div><p className="text-prose font-semibold">{t("holdTitle")}</p><p className="text-prose-muted mt-1 leading-relaxed">{t("holdBody")}</p></div></div>
        </form>
      </GlassPanel>
      <GlassPanel className="p-6 lg:sticky lg:top-28"><div className="flex items-center gap-3"><span className="bg-primary/12 text-primary grid size-11 place-items-center rounded-xl"><UtensilsCrossed className="size-5" aria-hidden /></span><div><h2 className="text-prose font-semibold">{localizedName(restaurant.name, loc)}</h2><p className="text-prose-muted text-xs">{localizedName(restaurant.address, loc)}</p></div></div><dl className="border-border mt-5 space-y-3 border-y py-5 text-sm"><div className="flex justify-between gap-3"><dt className="text-prose-muted flex items-center gap-2"><CalendarDays className="size-4" />{t("date")}</dt><dd className="text-prose font-medium">{date ? formatMediumDate(date, loc) : t("notSelected")}</dd></div><div className="flex justify-between gap-3"><dt className="text-prose-muted flex items-center gap-2"><Clock3 className="size-4" />{t("time")}</dt><dd className="text-prose font-medium">{timeSlot || t("notSelected")}</dd></div><div className="flex justify-between gap-3"><dt className="text-prose-muted flex items-center gap-2"><Users className="size-4" />{t("partySize")}</dt><dd className="text-prose font-medium">{partySize}</dd></div><div className="flex justify-between gap-3"><dt className="text-prose-muted">{t("zone")}</dt><dd className="text-prose font-medium">{selectedZone ? tz(selectedZone.id) : t("notSelected")}</dd></div></dl><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-3"><dt className="text-prose-muted">{t("listPrice")}</dt><dd className="text-prose font-medium">{formatMoney(listPriceSyp)}</dd></div>{discountSyp > 0 ? <div className="text-primary flex justify-between gap-3"><dt>{t("discount")}</dt><dd>− {formatMoney(discountSyp)}</dd></div> : null}<div className="border-border flex justify-between gap-3 border-t pt-4"><dt className="text-prose font-semibold">{t("cashDue")}</dt><dd className="text-prose text-end font-semibold">{formatMoney(cashDueSyp)}</dd></div></dl><p className="text-prose-muted mt-4 flex gap-2 text-xs leading-relaxed"><ShieldCheck className="text-primary size-4 shrink-0" aria-hidden />{t("cashDueHint")}</p><Button type="submit" className="mt-6 w-full" disabled={createBooking.isPending || !selectedZone || !timeSlot} onClick={() => void form.handleSubmit(onSubmit)()}>{createBooking.isPending ? t("confirming") : t("confirm")}</Button><Button href={`/restaurants/${restaurant.id}`} variant="glass" className="mt-3 w-full">{t("backToRestaurant")}</Button></GlassPanel>
    </div>
  );
}
