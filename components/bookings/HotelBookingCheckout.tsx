"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";
import { BedDouble, CalendarDays, Clock3, Hotel, ShieldCheck, Tag, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { Controller, useForm, useWatch, type FieldError } from "react-hook-form";

import { AuthFieldError } from "@/components/auth/AuthFieldError";
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
import { useCreateHotelBooking, useValidateHotelCoupon } from "@/hooks/useBookings";
import { useHotel } from "@/hooks/useHotels";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import { formatSyp } from "@/lib/format/money";
import { localizedName } from "@/lib/i18n/localized";
import type { CouponResult } from "@/lib/mock/bookings";
import {
  hotelBookingSchema,
  isHotelBookingErrorKey,
  type HotelBookingErrorKey,
  type HotelBookingValues,
} from "@/lib/validation/booking";
import { toast } from "@/store/toastStore";

type HotelBookingCheckoutProps = {
  hotelId: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests: number;
};

function fieldMessage(
  translate: (key: HotelBookingErrorKey) => string,
  error: FieldError | undefined,
): string | undefined {
  if (!error?.message) return undefined;
  return isHotelBookingErrorKey(error.message) ? translate(error.message) : error.message;
}

export function HotelBookingCheckout({
  hotelId,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
}: HotelBookingCheckoutProps): ReactNode {
  const t = useTranslations("bookings");
  const tErrors = useTranslations("bookings.errors");
  const tRooms = useTranslations("hotels.roomTypes");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const router = useRouter();
  const hotelQuery = useHotel(hotelId);
  const createBooking = useCreateHotelBooking();
  const couponMutation = useValidateHotelCoupon();
  const [coupon, setCoupon] = useState<CouponResult | null>(null);

  const today = format(new Date(), "yyyy-MM-dd");
  const defaultCheckIn = initialCheckIn ?? format(addDays(new Date(), 1), "yyyy-MM-dd");
  const defaultCheckOut = initialCheckOut ?? format(addDays(new Date(), 2), "yyyy-MM-dd");
  const form = useForm<HotelBookingValues>({
    resolver: zodResolver(hotelBookingSchema),
    defaultValues: {
      checkIn: defaultCheckIn,
      checkOut: defaultCheckOut,
      roomId: "",
      guests: initialGuests,
      specialRequests: "",
      couponCode: "",
    },
  });

  const checkIn = useWatch({ control: form.control, name: "checkIn" });
  const checkOut = useWatch({ control: form.control, name: "checkOut" });
  const roomId = useWatch({ control: form.control, name: "roomId" });
  const guests = useWatch({ control: form.control, name: "guests" });
  const couponCode = useWatch({ control: form.control, name: "couponCode" });
  const hotel = hotelQuery.data;
  const selectedRoom = hotel?.rooms.find((room) => room.id === roomId);
  const nights = useMemo(() => {
    if (!checkIn || !checkOut || checkOut <= checkIn) return 0;
    return differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn));
  }, [checkIn, checkOut]);
  const listPriceSyp = (selectedRoom?.priceSyp ?? 0) * nights;
  const activeCoupon = coupon?.valid && coupon.code === couponCode.trim().toUpperCase()
    ? coupon
    : null;
  const discountSyp = activeCoupon
    ? Math.round((listPriceSyp * activeCoupon.percent) / 100)
    : 0;
  const cashDueSyp = Math.max(0, listPriceSyp - discountSyp);

  if (hotelQuery.isPending) {
    return <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_24rem]"><Skeleton className="h-[42rem]" /><Skeleton className="h-96" /></div>;
  }
  if (hotelQuery.isError) {
    return <ErrorState title={t("states.loadErrorTitle")} description={t("states.loadErrorBody")} retryLabel={t("states.retry")} onRetry={() => void hotelQuery.refetch()} />;
  }
  if (!hotel) {
    return <EmptyState icon={Hotel} title={t("states.unavailableTitle")} description={t("states.unavailableBody")} action={<Button href="/hotels" variant="outline">{t("backToHotels")}</Button>} />;
  }
  const availableHotel = hotel;

  const roomOptions: SelectOption[] = availableHotel.rooms.map((room) => ({
    value: room.id,
    label: tRooms(room.type),
    hint: formatSyp(room.priceSyp, loc),
    disabled: room.available < 1 || room.maxGuests < guests,
  }));

  async function applyCoupon(): Promise<void> {
    const result = await couponMutation.mutateAsync(couponCode);
    setCoupon(result);
  }

  async function onSubmit(submitted: HotelBookingValues): Promise<void> {
    const room = availableHotel.rooms.find((item) => item.id === submitted.roomId);
    if (!room || room.maxGuests < submitted.guests || nights < 1) return;
    try {
      const booking = await createBooking.mutateAsync({
        hotelId: availableHotel.id,
        roomId: room.id,
        checkIn: submitted.checkIn,
        checkOut: submitted.checkOut,
        guests: submitted.guests,
        specialRequests: submitted.specialRequests,
        nights,
        listPriceSyp,
        discountSyp,
        cashDueSyp,
        couponCode: activeCoupon?.code ?? null,
      });
      router.push(`/bookings/${booking.id}`);
    } catch {
      toast.error(t("toastErrorTitle"), t("toastErrorBody"));
    }
  }

  return (
    <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <GlassPanel className="p-6 sm:p-8 lg:p-9">
        <div className="border-border border-b pb-6">
          <p className="text-primary text-sm font-semibold">{t("eyebrow")}</p>
          <h1 className="font-heading text-prose mt-2 text-3xl font-semibold sm:text-4xl">{t("title")}</h1>
          <p className="text-prose-muted mt-2">{localizedName(hotel.name, loc)}</p>
        </div>

        <form className="mt-7 space-y-7" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <section>
            <h2 className="font-heading text-prose text-xl font-semibold">{t("stayDetails")}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Controller control={form.control} name="checkIn" render={({ field }) => <DatePicker variant="main" required label={t("checkIn")} min={today} value={field.value} onChange={field.onChange} />} />
                <AuthFieldError message={fieldMessage(tErrors, form.formState.errors.checkIn)} />
              </div>
              <div className="space-y-1.5">
                <Controller control={form.control} name="checkOut" render={({ field }) => <DatePicker variant="main" required label={t("checkOut")} min={checkIn || today} centerOn={checkIn} value={field.value} onChange={field.onChange} />} />
                <AuthFieldError message={fieldMessage(tErrors, form.formState.errors.checkOut)} />
              </div>
              <div className="space-y-1.5">
                <Controller control={form.control} name="roomId" render={({ field }) => <Select variant="main" required label={t("roomType")} placeholder={t("roomPlaceholder")} options={roomOptions} value={field.value} onChange={field.onChange} icon={<BedDouble className="size-4" />} />} />
                <AuthFieldError message={fieldMessage(tErrors, form.formState.errors.roomId)} />
              </div>
              <div className="space-y-1.5">
                <Controller control={form.control} name="guests" render={({ field }) => <Stepper variant="main" required label={t("guests")} min={1} max={selectedRoom?.maxGuests ?? 8} value={field.value} onChange={(value) => { field.onChange(value); if (selectedRoom && value > selectedRoom.maxGuests) form.setValue("roomId", ""); }} />} />
                <AuthFieldError message={fieldMessage(tErrors, form.formState.errors.guests)} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-heading text-prose text-xl font-semibold">{t("requestsTitle")}</h2>
            <p className="text-prose-muted mt-1 text-sm">{t("requestsHint")}</p>
            <div className="mt-4 space-y-1.5">
              <Textarea variant="main" label={t("specialRequests")} placeholder={t("specialRequestsPlaceholder")} rows={4} {...form.register("specialRequests")} />
              <AuthFieldError message={fieldMessage(tErrors, form.formState.errors.specialRequests)} />
            </div>
          </section>

          <section>
            <h2 className="font-heading text-prose text-xl font-semibold">{t("discountTitle")}</h2>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
              <Input variant="main" label={t("discountCode")} placeholder={t("discountPlaceholder")} className="flex-1" {...form.register("couponCode", { onChange: () => setCoupon(null) })} />
              <Button type="button" variant="outline" className="sm:mt-0.5" disabled={!couponCode.trim() || couponMutation.isPending} onClick={() => void applyCoupon()}><Tag className="size-4" aria-hidden />{couponMutation.isPending ? t("applying") : t("apply")}</Button>
            </div>
            {coupon ? <p className={coupon.valid ? "text-primary mt-2 text-sm" : "text-destructive mt-2 text-sm"}>{coupon.valid ? t("discountApplied", { percent: coupon.percent }) : t("discountInvalid")}</p> : <p className="text-prose-muted mt-2 text-xs">{t("discountDemoHint")}</p>}
          </section>

          <div className="bg-glass-control flex gap-3 rounded-2xl p-4 text-sm">
            <Clock3 className="text-accent mt-0.5 size-5 shrink-0" aria-hidden />
            <div><p className="text-prose font-semibold">{t("holdTitle")}</p><p className="text-prose-muted mt-1 leading-relaxed">{t("holdBody")}</p></div>
          </div>
        </form>
      </GlassPanel>

      <GlassPanel className="p-6 lg:sticky lg:top-28">
        <div className="flex items-center gap-3"><div className="bg-primary/12 text-primary grid size-11 place-items-center rounded-xl"><Hotel className="size-5" aria-hidden /></div><div><h2 className="text-prose font-semibold">{localizedName(hotel.name, loc)}</h2><p className="text-prose-muted text-xs">{localizedName(hotel.address, loc)}</p></div></div>
        <dl className="border-border mt-5 space-y-3 border-y py-5 text-sm">
          <div className="flex justify-between gap-3"><dt className="text-prose-muted flex items-center gap-2"><CalendarDays className="size-4" />{t("dates")}</dt><dd className="text-prose text-end font-medium">{checkIn && checkOut ? `${formatMediumDate(checkIn, loc)} – ${formatMediumDate(checkOut, loc)}` : t("notSelected")}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-prose-muted flex items-center gap-2"><BedDouble className="size-4" />{t("room")}</dt><dd className="text-prose font-medium">{selectedRoom ? tRooms(selectedRoom.type) : t("notSelected")}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-prose-muted flex items-center gap-2"><Users className="size-4" />{t("guests")}</dt><dd className="text-prose font-medium">{guests}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-prose-muted">{t("nights")}</dt><dd className="text-prose font-medium">{nights}</dd></div>
        </dl>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-3"><dt className="text-prose-muted">{t("listPrice")}</dt><dd className="text-prose font-medium">{formatSyp(listPriceSyp, loc)}</dd></div>
          {discountSyp > 0 ? <div className="text-primary flex justify-between gap-3"><dt>{t("discount")}</dt><dd>− {formatSyp(discountSyp, loc)}</dd></div> : null}
          <div className="border-border flex justify-between gap-3 border-t pt-4"><dt className="text-prose font-semibold">{t("cashDue")}</dt><dd className="text-prose text-end font-semibold">{formatSyp(cashDueSyp, loc)}</dd></div>
        </dl>
        <p className="text-prose-muted mt-4 flex gap-2 text-xs leading-relaxed"><ShieldCheck className="text-primary size-4 shrink-0" aria-hidden />{t("cashDueHint")}</p>
        <Button type="submit" className="mt-6 w-full" disabled={createBooking.isPending || !selectedRoom || nights < 1} onClick={() => void form.handleSubmit(onSubmit)()}>{createBooking.isPending ? t("confirming") : t("confirm")}</Button>
        <Button href={`/hotels/${hotel.id}`} variant="glass" className="mt-3 w-full">{t("backToStay")}</Button>
      </GlassPanel>
    </div>
  );
}
