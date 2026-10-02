"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, differenceInCalendarDays, parseISO } from "date-fns";
import { BedDouble, CalendarDays, Clock3, Hotel, Moon, Users } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
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
import { useCreateHotelBooking, useValidateBookingCoupon } from "@/hooks/useBookings";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import { useHotel } from "@/hooks/useHotels";
import type { Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/translations";
import { formatMediumDate, toIsoDate } from "@/lib/format/datetime";
import { formatCount } from "@/lib/format/number";
import { localizedName } from "@/lib/i18n/localized";
import { calculateCouponDiscountSyp, type CouponResult } from "@/lib/mock/bookings";
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
  const paths = useBookingPaths();
  const formatMoney = useFormatSyp();
  const hotelQuery = useHotel(hotelId);
  const createBooking = useCreateHotelBooking();
  const couponMutation = useValidateBookingCoupon();
  const [coupon, setCoupon] = useState<CouponResult | null>(null);

  const today = toIsoDate(new Date());
  const defaultCheckIn = initialCheckIn ?? toIsoDate(addDays(new Date(), 1));
  const defaultCheckOut = initialCheckOut ?? toIsoDate(addDays(parseISO(defaultCheckIn), 1));
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
  const activeCoupon = coupon?.valid ? coupon : null;
  const discountSyp = calculateCouponDiscountSyp(activeCoupon, listPriceSyp);
  const cashDueSyp = Math.max(0, listPriceSyp - discountSyp);
  /** No price until a room is picked (a 0 SYP total reads as free). */
  const price = (amountSyp: number): string => (selectedRoom ? formatMoney(amountSyp) : "—");

  if (hotelQuery.isPending) {
    return <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_24rem]"><Skeleton className="h-[42rem]" /><Skeleton className="h-96" /></div>;
  }
  if (hotelQuery.isError) {
    return <ErrorState title={t("states.loadErrorTitle")} description={t("states.loadErrorBody")} retryLabel={t("states.retry")} onRetry={() => void hotelQuery.refetch()} />;
  }
  if (!hotel) {
    return <EmptyState icon={Hotel} title={t("states.unavailableTitle")} description={t("states.unavailableBody")} action={<Button href={paths.catalog("hotels")} variant="outline">{t("backToHotels")}</Button>} />;
  }
  const availableHotel = hotel;

  const roomOptions: SelectOption[] = availableHotel.rooms.map((room) => ({
    value: room.id,
    label: tRooms(room.type),
    hint: formatMoney(room.priceSyp),
    disabled: room.available < 1 || room.maxGuests < guests,
  }));

  async function applyCoupon(): Promise<void> {
    const result = await couponMutation.mutateAsync({
      code: couponCode,
      bookingType: "hotel",
      listingId: availableHotel.id,
    });
    setCoupon(result);
  }

  async function onSubmit(submitted: HotelBookingValues): Promise<void> {
    const room = availableHotel.rooms.find((item) => item.id === submitted.roomId);
    if (nights < 1) {
      form.setError("checkOut", { message: "checkOutAfterCheckIn" });
      return;
    }
    if (!room || room.maxGuests < submitted.guests) {
      form.setError("roomId", { message: "roomRequired" });
      return;
    }
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
      router.push(paths.voucher(booking.id));
    } catch {
      toast.error(t("toastErrorTitle"), t("toastErrorBody"));
    }
  }

  const confirm = { label: createBooking.isPending ? t("confirming") : t("confirm"), disabled: createBooking.isPending || !selectedRoom || nights < 1, onClick: () => void form.handleSubmit(onSubmit)() };

  return (
    <div className={CHECKOUT_GRID}>
      <GlassPanel className="p-6 sm:p-8 lg:p-9">
        <form className="space-y-7" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <section>
            <h2 className="font-heading text-prose text-xl font-semibold">{t("stayDetails")}</h2>
            <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2">
              <div className="min-w-0 space-y-1.5">
                <Controller control={form.control} name="checkIn" render={({ field }) => <DatePicker variant="main" required label={t("checkIn")} min={today} value={field.value} onChange={field.onChange} />} />
                <AuthFieldError message={fieldMessage(tErrors, form.formState.errors.checkIn)} />
              </div>
              <div className="min-w-0 space-y-1.5">
                <Controller control={form.control} name="checkOut" render={({ field }) => <DatePicker variant="main" required label={t("checkOut")} min={checkIn || today} centerOn={checkIn} value={field.value} onChange={field.onChange} />} />
                <AuthFieldError message={fieldMessage(tErrors, form.formState.errors.checkOut)} />
              </div>
              <div className="min-w-0 space-y-1.5">
                <Controller control={form.control} name="roomId" render={({ field }) => <Select variant="main" required label={t("roomType")} placeholder={t("roomPlaceholder")} options={roomOptions} value={field.value} onChange={field.onChange} icon={<BedDouble className="size-4" />} />} />
                <AuthFieldError message={fieldMessage(tErrors, form.formState.errors.roomId)} />
              </div>
              <div className="min-w-0 space-y-1.5">
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
            <div><p className="text-prose font-semibold">{t("holdTitle")}</p><p className="text-prose-muted mt-1 leading-relaxed">{t("holdBody")}</p></div>
          </div>
        </form>
      </GlassPanel>

      <BookingSummaryCard
        icon={Hotel}
        title={localizedName(hotel.name, loc)}
        subtitle={localizedName(hotel.address, loc)}
        rows={[
          { id: "dates", label: t("dates"), icon: CalendarDays, value: checkIn && checkOut ? (
                <>
                  <span className="whitespace-nowrap">{formatMediumDate(checkIn, loc)}</span> –{" "}
                  <span className="whitespace-nowrap">{formatMediumDate(checkOut, loc)}</span>
                </>
              ) : (
                t("notSelected")
              ) },
          { id: "room", label: t("room"), icon: BedDouble, value: selectedRoom ? tRooms(selectedRoom.type) : t("notSelected") },
          { id: "guests", label: t("guests"), icon: Users, value: formatCount(guests, loc) },
          { id: "nights", label: t("nights"), icon: Moon, value: formatCount(nights, loc) },
        ]}
        listPrice={{ label: t("listPrice"), value: price(listPriceSyp) }}
        discount={discountSyp > 0 ? { label: t("discount"), value: `− ${formatMoney(discountSyp)}` } : null}
        cashDue={{ label: t("cashDue"), value: price(cashDueSyp) }}
        priceHint={selectedRoom ? null : t("chooseRoomForPrice")}
        cashDueHint={t("cashDueHint")}
        confirm={confirm}
        back={{ href: paths.listing("hotels", hotel.id), label: t("backToStay") }}
      />
      <BookingConfirmBar cashDue={{ label: t("cashDue"), value: price(cashDueSyp) }} priceHint={selectedRoom ? null : t("chooseRoomForPrice")} confirm={confirm} />
    </div>
  );
}
