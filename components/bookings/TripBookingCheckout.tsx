"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Clock3, Compass, MapPin, MapPinned, Users } from "lucide-react";
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
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Stepper } from "@/components/ui/Stepper";
import { useBookingPaths } from "@/hooks/useBookingPaths";
import { useCreateTripBooking, useValidateBookingCoupon } from "@/hooks/useBookings";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import { useTrip } from "@/hooks/useTrips";
import type { Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/translations";
import { formatMediumDate, formatPickerTime } from "@/lib/format/datetime";
import { normalizePhoneInput } from "@/lib/format/digits";
import { formatCount } from "@/lib/format/number";
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
  const paths = useBookingPaths();
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
  const priceReady = Boolean(departure && pickup);
  const price = (amountSyp: number): string => (priceReady ? formatMoney(amountSyp) : "—");

  if (tripQuery.isPending) return <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_24rem]"><Skeleton className="h-[42rem]" /><Skeleton className="h-96" /></div>;
  if (tripQuery.isError) return <ErrorState title={t("states.loadErrorTitle")} description={t("states.loadErrorBody")} retryLabel={t("states.retry")} onRetry={() => void tripQuery.refetch()} />;
  if (!trip) return <EmptyState icon={Compass} title={t("states.unavailableTitle")} description={t("states.unavailableBody")} action={<Button href={paths.catalog("trips")} variant="outline">{t("backToTrips")}</Button>} />;
  const availableTrip = trip;
  const departures: SelectOption[] = availableTrip.departures.map((item) => ({ value: item.date, label: formatMediumDate(item.date, loc), hint: t("seatsAvailable", { count: item.seatsLeft }), disabled: item.seatsLeft < seats }));
  const pickups: SelectOption[] = availableTrip.pickupPoints.map((item) => ({ value: item.id, label: localizedName(item.name, loc), hint: formatPickerTime(item.time, loc) }));

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
    if (!selectedDeparture) { form.setError("date", { message: "dateRequired" }); return; }
    if (selectedDeparture.seatsLeft < values.seats) { form.setError("seats", { message: "seatsMax" }); return; }
    if (!selectedPickup) { form.setError("pickupPointId", { message: "pickupRequired" }); return; }
    try {
      const booking = await createBooking.mutateAsync({ tripId: availableTrip.id, date: values.date, seats: values.seats, pickupPointId: values.pickupPointId, emergencyContact: values.emergencyContact, listPriceSyp, discountSyp, cashDueSyp, couponCode: activeCoupon?.code ?? null });
      router.push(paths.voucher(booking.id));
    } catch { toast.error(t("toastErrorTitle"), t("toastErrorBody")); }
  }

  const confirm = { label: createBooking.isPending ? t("confirming") : t("confirm"), disabled: createBooking.isPending || !departure || !pickup, onClick: () => void form.handleSubmit(onSubmit)() };

  return (
    <div className={CHECKOUT_GRID}>
      <GlassPanel className="p-6 sm:p-8 lg:p-9">
        <form className="space-y-7" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <section><h2 className="font-heading text-prose text-xl font-semibold">{t("tripDetails")}</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Controller control={form.control} name="date" render={({ field }) => <Select variant="main" required label={t("date")} placeholder={t("datePlaceholder")} options={departures} value={field.value} onChange={field.onChange} icon={<CalendarDays className="size-4" />} />} /><AuthFieldError message={message(te, form.formState.errors.date)} /></div>
            <div className="space-y-1.5"><Controller control={form.control} name="seats" render={({ field }) => <Stepper variant="main" required label={t("seats")} min={1} max={Math.min(12, departure?.seatsLeft ?? availableTrip.capacity)} value={field.value} onChange={field.onChange} />} /><AuthFieldError message={message(te, form.formState.errors.seats)} /></div>
            <div className="space-y-1.5 sm:col-span-2"><Controller control={form.control} name="pickupPointId" render={({ field }) => <Select variant="main" required label={t("pickup")} placeholder={t("pickupPlaceholder")} options={pickups} value={field.value} onChange={field.onChange} icon={<MapPin className="size-4" />} />} /><AuthFieldError message={message(te, form.formState.errors.pickupPointId)} /></div>
            <div className="space-y-1.5 sm:col-span-2"><Input variant="main" required label={t("emergencyContact")} placeholder={t("emergencyContactPlaceholder")} type="tel" dir="ltr" inputMode="tel" autoComplete="tel" {...form.register("emergencyContact", { setValueAs: normalizePhoneInput })} /><AuthFieldError message={message(te, form.formState.errors.emergencyContact)} /></div>
          </div></section>

          <section className="bg-glass-control rounded-2xl p-5"><div className="flex gap-3"><Clock3 className="text-accent mt-0.5 size-5 shrink-0" aria-hidden /><div><h2 className="text-prose font-semibold">{t("holdTitle")}</h2><p className="text-prose-muted mt-1 text-sm leading-relaxed">{t("holdBody")}</p></div></div></section>

          <BookingReliabilityNotice />

          <BookingPolicyNote />

          <section><h2 className="font-heading text-prose text-xl font-semibold">{t("discountTitle")}</h2><BookingCouponField
              label={t("discountCode")}
              placeholder={t("discountPlaceholder")}
              applyLabel={couponMutation.isPending ? t("applying") : t("apply")}
              disabled={couponMutation.isPending || !couponCode.trim()}
              onApply={() => void applyCoupon()}
              field={form.register("couponCode", { onChange: () => setCoupon(null) })}
            /><BookingCouponFeedback coupon={coupon} formatMoney={formatMoney} /></section>
        </form>
      </GlassPanel>

      <BookingSummaryCard
        icon={MapPinned}
        title={localizedName(trip.name, loc)}
        subtitle={localizedName(trip.address, loc)}
        rows={[
          { id: "date", label: t("date"), icon: CalendarDays, value: date ? formatMediumDate(date, loc) : t("notSelected") },
          { id: "seats", label: t("seats"), icon: Users, value: formatCount(seats, loc) },
          { id: "pickup", label: t("pickup"), icon: MapPin, value: pickup ? localizedName(pickup.name, loc) : t("notSelected") },
        ]}
        listPrice={{ label: t("listPrice"), value: price(listPriceSyp) }}
        discount={discountSyp > 0 ? { label: t("discount"), value: `− ${formatMoney(discountSyp)}` } : null}
        cashDue={{ label: t("cashDue"), value: price(cashDueSyp) }}
        priceHint={priceReady ? null : t("chooseOptionForPrice")}
        cashDueHint={t("cashDueHint")}
        confirm={confirm}
        back={{ href: paths.listing("trips", trip.id), label: t("backToTrip") }}
      />
      <BookingConfirmBar cashDue={{ label: t("cashDue"), value: price(cashDueSyp) }} priceHint={priceReady ? null : t("chooseOptionForPrice")} confirm={confirm} />
    </div>
  );
}
