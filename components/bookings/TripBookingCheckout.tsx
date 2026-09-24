"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CalendarDays, Clock3, Compass, MapPin, ShieldCheck, Tag, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Controller, useForm, useWatch, type FieldError } from "react-hook-form";

import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { BookingCouponFeedback } from "@/components/bookings/BookingCouponFeedback";
import { BookingReliabilityNotice } from "@/components/bookings/BookingReliabilityNotice";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Stepper } from "@/components/ui/Stepper";
import { useCreateTripBooking, useValidateBookingCoupon } from "@/hooks/useBookings";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import { useTrip } from "@/hooks/useTrips";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import { localizedName } from "@/lib/i18n/localized";
import { calculateCouponDiscountSyp, type CouponResult } from "@/lib/mock/bookings";
import { isTripBookingErrorKey, tripBookingSchema, type TripBookingErrorKey, type TripBookingValues } from "@/lib/validation/booking";
import { toast } from "@/store/toastStore";

function message(t: (key: TripBookingErrorKey) => string, error: FieldError | undefined): string | undefined {
  if (!error?.message) return undefined;
  return isTripBookingErrorKey(error.message) ? t(error.message) : error.message;
}

export function TripBookingCheckout({ tripId, initialDate, initialSeats }: { tripId: string; initialDate?: string; initialSeats: number }): ReactNode {
  const t = useTranslations("tripBooking");
  const te = useTranslations("tripBooking.errors");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const router = useRouter();
  const formatMoney = useFormatSyp();
  const tripQuery = useTrip(tripId);
  const createBooking = useCreateTripBooking();
  const couponMutation = useValidateBookingCoupon();
  const [coupon, setCoupon] = useState<CouponResult | null>(null);
  const form = useForm<TripBookingValues>({ resolver: zodResolver(tripBookingSchema), defaultValues: { date: initialDate ?? "", seats: initialSeats, pickupPointId: "", emergencyContact: "", couponCode: "" } });
  const date = useWatch({ control: form.control, name: "date" });
  const seats = useWatch({ control: form.control, name: "seats" });
  const pickupPointId = useWatch({ control: form.control, name: "pickupPointId" });
  const couponCode = useWatch({ control: form.control, name: "couponCode" });
  const trip = tripQuery.data;
  const departure = trip?.departures.find((item) => item.date === date);
  const pickup = trip?.pickupPoints.find((item) => item.id === pickupPointId);
  const listPriceSyp = (trip?.pricePerSeatSyp ?? 0) * seats;
  const activeCoupon = coupon?.valid ? coupon : null;
  const discountSyp = calculateCouponDiscountSyp(activeCoupon, listPriceSyp);
  const cashDueSyp = Math.max(0, listPriceSyp - discountSyp);

  if (tripQuery.isPending) return <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_24rem]"><Skeleton className="h-[42rem]" /><Skeleton className="h-96" /></div>;
  if (tripQuery.isError) return <ErrorState title={t("states.loadErrorTitle")} description={t("states.loadErrorBody")} retryLabel={t("states.retry")} onRetry={() => void tripQuery.refetch()} />;
  if (!trip) return <EmptyState icon={Compass} title={t("states.unavailableTitle")} description={t("states.unavailableBody")} action={<Button href="/trips" variant="outline">{t("backToTrips")}</Button>} />;
  const availableTrip = trip;
  const departures: SelectOption[] = availableTrip.departures.map((item) => ({ value: item.date, label: formatMediumDate(item.date, loc), hint: t("seatsAvailable", { count: item.seatsLeft }), disabled: item.seatsLeft < seats }));
  const pickups: SelectOption[] = availableTrip.pickupPoints.map((item) => ({ value: item.id, label: localizedName(item.name, loc), hint: item.time }));

  async function applyCoupon(): Promise<void> {
    setCoupon(await couponMutation.mutateAsync({
      code: couponCode,
      bookingType: "trip",
      listingId: availableTrip.id,
    }));
  }
  async function onSubmit(values: TripBookingValues): Promise<void> {
    const selectedDeparture = availableTrip.departures.find((item) => item.date === values.date);
    const selectedPickup = availableTrip.pickupPoints.find((item) => item.id === values.pickupPointId);
    if (!selectedDeparture || selectedDeparture.seatsLeft < values.seats || !selectedPickup) return;
    try {
      const booking = await createBooking.mutateAsync({ tripId: availableTrip.id, date: values.date, seats: values.seats, pickupPointId: values.pickupPointId, emergencyContact: values.emergencyContact, listPriceSyp, discountSyp, cashDueSyp, couponCode: activeCoupon?.code ?? null });
      router.push(`/bookings/${booking.id}`);
    } catch { toast.error(t("toastErrorTitle"), t("toastErrorBody")); }
  }

  return (
    <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <GlassPanel className="p-6 sm:p-8 lg:p-9">
        <div className="border-border border-b pb-6"><p className="text-primary text-sm font-semibold">{t("eyebrow")}</p><h1 className="font-heading text-prose mt-2 text-3xl font-semibold sm:text-4xl">{t("title")}</h1><p className="text-prose-muted mt-2">{localizedName(trip.name, loc)}</p></div>
        <form className="mt-7 space-y-7" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <section><h2 className="font-heading text-prose text-xl font-semibold">{t("tripDetails")}</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Controller control={form.control} name="date" render={({ field }) => <Select variant="main" required label={t("date")} placeholder={t("datePlaceholder")} options={departures} value={field.value} onChange={field.onChange} icon={<CalendarDays className="size-4" />} />} /><AuthFieldError message={message(te, form.formState.errors.date)} /></div>
            <div className="space-y-1.5"><Controller control={form.control} name="seats" render={({ field }) => <Stepper variant="main" required label={t("seats")} min={1} max={Math.min(12, departure?.seatsLeft ?? availableTrip.capacity)} value={field.value} onChange={field.onChange} />} /><AuthFieldError message={message(te, form.formState.errors.seats)} /></div>
            <div className="space-y-1.5 sm:col-span-2"><Controller control={form.control} name="pickupPointId" render={({ field }) => <Select variant="main" required label={t("pickup")} placeholder={t("pickupPlaceholder")} options={pickups} value={field.value} onChange={field.onChange} icon={<MapPin className="size-4" />} />} /><AuthFieldError message={message(te, form.formState.errors.pickupPointId)} /></div>
            <div className="space-y-1.5 sm:col-span-2"><Input variant="main" required label={t("emergencyContact")} placeholder={t("emergencyContactPlaceholder")} inputMode="tel" autoComplete="tel" {...form.register("emergencyContact")} /><AuthFieldError message={message(te, form.formState.errors.emergencyContact)} /></div>
          </div></section>

          <section className="bg-glass-control rounded-2xl p-5"><div className="flex gap-3"><Clock3 className="text-accent mt-0.5 size-5 shrink-0" aria-hidden /><div><h2 className="text-prose font-semibold">{t("holdTitle")}</h2><p className="text-prose-muted mt-1 text-sm leading-relaxed">{t("holdBody")}</p></div></div></section>

          <BookingReliabilityNotice />

          <section><h2 className="font-heading text-prose text-xl font-semibold">{t("discountTitle")}</h2><div className="mt-4 flex flex-col gap-3 sm:flex-row"><Input variant="main" label={t("discountCode")} placeholder={t("discountPlaceholder")} className="flex-1" {...form.register("couponCode", { onChange: () => setCoupon(null) })} /><Button type="button" variant="outline" disabled={couponMutation.isPending || !couponCode.trim()} onClick={() => void applyCoupon()}><Tag className="size-4" aria-hidden />{couponMutation.isPending ? t("applying") : t("apply")}</Button></div><BookingCouponFeedback coupon={coupon} formatMoney={formatMoney} /></section>
        </form>
      </GlassPanel>

      <GlassPanel className="p-6 lg:sticky lg:top-28">
        <p className="text-primary text-xs font-bold uppercase tracking-[0.14em]">{t("summary")}</p><h2 className="font-heading text-prose mt-2 text-2xl font-semibold">{localizedName(trip.name, loc)}</h2>
        <dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-3"><dt className="text-prose-muted flex items-center gap-2"><CalendarDays className="size-4" aria-hidden />{t("date")}</dt><dd className="text-prose text-end font-medium">{date ? formatMediumDate(date, loc) : t("notSelected")}</dd></div><div className="flex justify-between gap-3"><dt className="text-prose-muted flex items-center gap-2"><Users className="size-4" aria-hidden />{t("seats")}</dt><dd className="text-prose font-medium">{seats}</dd></div><div className="flex justify-between gap-3"><dt className="text-prose-muted flex items-center gap-2"><MapPin className="size-4" aria-hidden />{t("pickup")}</dt><dd className="text-prose max-w-44 text-end font-medium">{pickup ? localizedName(pickup.name, loc) : t("notSelected")}</dd></div></dl>
        <dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-3"><dt className="text-prose-muted">{t("listPrice")}</dt><dd className="text-prose font-medium">{formatMoney(listPriceSyp)}</dd></div>{discountSyp > 0 ? <div className="text-primary flex justify-between gap-3"><dt>{t("discount")}</dt><dd>− {formatMoney(discountSyp)}</dd></div> : null}<div className="border-border flex justify-between gap-3 border-t pt-4"><dt className="text-prose font-semibold">{t("cashDue")}</dt><dd className="text-prose text-end font-semibold">{formatMoney(cashDueSyp)}</dd></div></dl>
        <p className="text-prose-muted mt-4 flex gap-2 text-xs leading-relaxed"><ShieldCheck className="text-primary size-4 shrink-0" aria-hidden />{t("cashDueHint")}</p>
        <Button type="submit" className="mt-6 w-full" disabled={createBooking.isPending || !departure || !pickup} onClick={() => void form.handleSubmit(onSubmit)()}>{createBooking.isPending ? t("confirming") : t("confirm")}</Button>
        <Button href={`/trips/${trip.id}`} variant="glass" className="mt-3 w-full"><ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />{t("backToTrip")}</Button>
      </GlassPanel>
    </div>
  );
}
