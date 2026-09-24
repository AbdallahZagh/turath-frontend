"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, MessageSquareQuote, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { Controller, useForm, type FieldError } from "react-hook-form";

import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Textarea";
import { useSubmitTouristBookingReview, useTouristBooking } from "@/hooks/useBookings";
import { useEvent } from "@/hooks/useEvents";
import { useHotel } from "@/hooks/useHotels";
import { useGuide } from "@/hooks/useGuides";
import { useRestaurant } from "@/hooks/useRestaurants";
import { useTrip } from "@/hooks/useTrips";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { localizedName } from "@/lib/i18n/localized";
import {
  bookingReviewSchema,
  isBookingReviewErrorKey,
  type BookingReviewErrorKey,
  type BookingReviewValues,
} from "@/lib/validation/review";
import { toast } from "@/store/toastStore";

type BookingReviewFormProps = { bookingId: string };

function reviewError(t: (key: BookingReviewErrorKey) => string, error: FieldError | undefined): string | undefined {
  if (!error?.message) return undefined;
  return isBookingReviewErrorKey(error.message) ? t(error.message) : error.message;
}

export function BookingReviewForm({ bookingId }: BookingReviewFormProps): ReactNode {
  const t = useTranslations("bookingReview");
  const tErrors = useTranslations("bookingReview.errors");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const bookingQuery = useTouristBooking(bookingId);
  const booking = bookingQuery.data;
  const hotelQuery = useHotel(booking?.type === "hotel" ? booking.hotelId : "");
  const restaurantQuery = useRestaurant(booking?.type === "restaurant" ? booking.restaurantId : "");
  const tripQuery = useTrip(booking?.type === "trip" ? booking.tripId : "");
  const eventQuery = useEvent(booking?.type === "event" ? booking.eventId : "");
  const guideQuery = useGuide(booking?.type === "guide" ? booking.guideId : "");
  const submitReview = useSubmitTouristBookingReview();
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<BookingReviewValues>({ resolver: zodResolver(bookingReviewSchema), defaultValues: { rating: 0, comment: "" } });

  if (bookingQuery.isPending) return <Skeleton className="mx-auto h-[30rem] max-w-2xl" />;
  if (bookingQuery.isError) return <ErrorState title={t("errorTitle")} description={t("errorBody")} retryLabel={t("retry")} onRetry={() => void bookingQuery.refetch()} />;
  if (!booking) {
    return <EmptyState icon={MessageSquareQuote} title={t("unavailableTitle")} description={t("unavailableBody")} action={<Button href="/user/bookings" variant="outline">{t("back")}</Button>} />;
  }
  const providerQuery = booking.type === "restaurant" ? restaurantQuery : booking.type === "trip" ? tripQuery : booking.type === "event" ? eventQuery : booking.type === "guide" ? guideQuery : hotelQuery;
  if (providerQuery.isPending) return <Skeleton className="mx-auto h-[30rem] max-w-2xl" />;
  if (providerQuery.isError) return <ErrorState title={t("errorTitle")} description={t("errorBody")} retryLabel={t("retry")} onRetry={() => void providerQuery.refetch()} />;
  const provider = providerQuery.data;
  if (!provider || booking.status !== "CHECKED_IN") {
    return <EmptyState icon={MessageSquareQuote} title={t("unavailableTitle")} description={t("unavailableBody")} action={<Button href={`/bookings/${booking.id}`} variant="outline">{t("back")}</Button>} />;
  }

  async function onSubmit(values: BookingReviewValues): Promise<void> {
    try {
      await submitReview.mutateAsync({ bookingId, ...values });
      setSubmitted(true);
    } catch {
      toast.error(t("errorTitle"), t("errorBody"));
    }
  }

  if (submitted) {
    return <GlassPanel className="mx-auto max-w-2xl items-center px-6 py-14 text-center"><span className="bg-primary/12 text-primary grid size-14 place-items-center rounded-2xl"><CheckCircle2 className="size-7" aria-hidden /></span><h1 className="font-heading text-prose mt-5 text-3xl font-semibold">{t("thanksTitle")}</h1><p className="text-prose-muted mt-2 max-w-md text-sm">{t("thanksBody")}</p><Button href="/user/bookings" className="mt-7">{t("backToBookings")}</Button></GlassPanel>;
  }

  return (
    <GlassPanel className="mx-auto max-w-2xl p-6 sm:p-8">
      <p className="text-primary text-xs font-bold uppercase tracking-[0.15em]">{t("eyebrow")}</p>
      <h1 className="font-heading text-prose mt-2 text-3xl font-semibold">{t("title")}</h1>
      <p className="text-prose-muted mt-2 text-sm">{t("description", { provider: localizedName(provider.name, loc) })}</p>
      <form className="mt-7 space-y-6" noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <p className="text-prose mb-3 text-sm font-semibold">{t("rating")}</p>
          <Controller control={form.control} name="rating" render={({ field }) => <div className="flex gap-2" role="radiogroup" aria-label={t("rating")}>{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" role="radio" aria-checked={field.value === value} aria-label={t("star", { count: value })} className="hover:bg-option-hover rounded-xl p-2 transition-colors" onClick={() => field.onChange(value)}><Star className={cn("size-7", value <= field.value ? "fill-accent text-accent" : "text-border")} aria-hidden /></button>)}</div>} />
          <AuthFieldError message={reviewError(tErrors, form.formState.errors.rating)} />
        </div>
        <div className="space-y-1.5"><Textarea variant="main" label={t("comment")} placeholder={t("commentPlaceholder")} rows={6} {...form.register("comment")} /><AuthFieldError message={reviewError(tErrors, form.formState.errors.comment)} /></div>
        <div className="flex flex-wrap gap-3"><Button type="submit" disabled={submitReview.isPending}>{submitReview.isPending ? t("submitting") : t("submit")}</Button><Button href={`/bookings/${booking.id}`} variant="glass">{t("back")}</Button></div>
      </form>
    </GlassPanel>
  );
}
