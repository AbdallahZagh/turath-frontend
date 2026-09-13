"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CalendarDays, CalendarHeart, Clock3, MapPin, ShieldCheck, Tag, Ticket, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Controller, useForm, useWatch, type FieldError } from "react-hook-form";

import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Stepper } from "@/components/ui/Stepper";
import { useCreateEventBooking, useValidateBookingCoupon } from "@/hooks/useBookings";
import { useEvent } from "@/hooks/useEvents";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import { formatSyp } from "@/lib/format/money";
import { localizedName } from "@/lib/i18n/localized";
import type { CouponResult } from "@/lib/mock/bookings";
import { eventBookingSchema, isEventBookingErrorKey, type EventBookingErrorKey, type EventBookingValues } from "@/lib/validation/booking";
import { toast } from "@/store/toastStore";

function message(t: (key: EventBookingErrorKey) => string, error: FieldError | undefined): string | undefined {
  if (!error?.message) return undefined;
  return isEventBookingErrorKey(error.message) ? t(error.message) : error.message;
}

export function EventBookingCheckout({ eventId, initialSessionId, initialQuantity }: { eventId: string; initialSessionId?: string; initialQuantity: number }): ReactNode {
  const t = useTranslations("eventBooking");
  const te = useTranslations("eventBooking.errors");
  const tt = useTranslations("events.tiers");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const router = useRouter();
  const eventQuery = useEvent(eventId);
  const createBooking = useCreateEventBooking();
  const couponMutation = useValidateBookingCoupon();
  const [coupon, setCoupon] = useState<CouponResult | null>(null);
  const form = useForm<EventBookingValues>({ resolver: zodResolver(eventBookingSchema), defaultValues: { sessionId: initialSessionId ?? "", ticketTier: undefined, quantity: initialQuantity, couponCode: "" } });
  const sessionId = useWatch({ control: form.control, name: "sessionId" });
  const ticketTier = useWatch({ control: form.control, name: "ticketTier" });
  const quantity = useWatch({ control: form.control, name: "quantity" });
  const couponCode = useWatch({ control: form.control, name: "couponCode" });
  const event = eventQuery.data;
  const session = event?.sessions.find((item) => item.id === sessionId);
  const tier = session?.tiers.find((item) => item.id === ticketTier);
  const listPriceSyp = (tier?.priceSyp ?? 0) * quantity;
  const activeCoupon = coupon?.valid && coupon.code === couponCode.trim().toUpperCase() ? coupon : null;
  const discountSyp = activeCoupon ? Math.round((listPriceSyp * activeCoupon.percent) / 100) : 0;
  const cashDueSyp = Math.max(0, listPriceSyp - discountSyp);

  if (eventQuery.isPending) return <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_24rem]"><Skeleton className="h-[40rem]" /><Skeleton className="h-96" /></div>;
  if (eventQuery.isError) return <ErrorState title={t("states.loadErrorTitle")} description={t("states.loadErrorBody")} retryLabel={t("states.retry")} onRetry={() => void eventQuery.refetch()} />;
  if (!event) return <EmptyState icon={CalendarHeart} title={t("states.unavailableTitle")} description={t("states.unavailableBody")} action={<Button href="/events" variant="outline">{t("backToEvents")}</Button>} />;
  const availableEvent = event;
  const sessions: SelectOption[] = availableEvent.sessions.map((item) => ({ value: item.id, label: formatMediumDate(item.date, loc), hint: `${item.startsAt}–${item.endsAt}` }));
  const tiers: SelectOption[] = (session?.tiers ?? []).map((item) => ({ value: item.id, label: tt(item.id), hint: `${formatSyp(item.priceSyp, loc)} · ${t("remaining", { count: item.remaining })}`, disabled: item.remaining < quantity }));

  async function applyCoupon(): Promise<void> { setCoupon(await couponMutation.mutateAsync(couponCode)); }
  async function onSubmit(values: EventBookingValues): Promise<void> {
    const selectedSession = availableEvent.sessions.find((item) => item.id === values.sessionId);
    const selectedTier = selectedSession?.tiers.find((item) => item.id === values.ticketTier);
    if (!selectedSession || !selectedTier || selectedTier.remaining < values.quantity) return;
    try {
      const booking = await createBooking.mutateAsync({ eventId: availableEvent.id, sessionId: selectedSession.id, ticketTier: selectedTier.id, quantity: values.quantity, date: selectedSession.date, startsAt: selectedSession.startsAt, listPriceSyp, discountSyp, cashDueSyp, couponCode: activeCoupon?.code ?? null });
      router.push(`/bookings/${booking.id}`);
    } catch { toast.error(t("toastErrorTitle"), t("toastErrorBody")); }
  }

  return <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_24rem]"><GlassPanel className="p-6 sm:p-8 lg:p-9"><div className="border-border border-b pb-6"><p className="text-primary text-sm font-semibold">{t("eyebrow")}</p><h1 className="font-heading text-prose mt-2 text-3xl font-semibold sm:text-4xl">{t("title")}</h1><p className="text-prose-muted mt-2">{localizedName(event.name, loc)}</p></div><form className="mt-7 space-y-7" noValidate onSubmit={form.handleSubmit(onSubmit)}>
    <section><h2 className="font-heading text-prose text-xl font-semibold">{t("ticketDetails")}</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><div className="space-y-1.5 sm:col-span-2"><Controller control={form.control} name="sessionId" render={({ field }) => <Select variant="main" required label={t("session")} placeholder={t("sessionPlaceholder")} options={sessions} value={field.value} onChange={field.onChange} icon={<CalendarDays className="size-4" />} />} /><AuthFieldError message={message(te, form.formState.errors.sessionId)} /></div><div className="space-y-1.5"><Controller control={form.control} name="ticketTier" render={({ field }) => <Select variant="main" required disabled={!session} label={t("tier")} placeholder={t("tierPlaceholder")} options={tiers} value={field.value} onChange={field.onChange} icon={<Ticket className="size-4" />} />} /><AuthFieldError message={message(te, form.formState.errors.ticketTier)} /></div><div className="space-y-1.5"><Controller control={form.control} name="quantity" render={({ field }) => <Stepper variant="main" required label={t("quantity")} min={1} max={Math.min(6, tier?.remaining ?? 6)} value={field.value} onChange={field.onChange} icon={<Users className="size-4" />} />} /><AuthFieldError message={message(te, form.formState.errors.quantity)} /></div></div></section>
    <section className="bg-glass-control rounded-2xl p-5"><div className="flex gap-3"><Clock3 className="text-accent mt-0.5 size-5 shrink-0" aria-hidden /><div><h2 className="text-prose font-semibold">{t("holdTitle")}</h2><p className="text-prose-muted mt-1 text-sm leading-relaxed">{t("holdBody")}</p></div></div></section>
    <section><h2 className="font-heading text-prose text-xl font-semibold">{t("discountTitle")}</h2><div className="mt-4 flex flex-col gap-3 sm:flex-row"><Input variant="main" label={t("discountCode")} placeholder={t("discountPlaceholder")} className="flex-1" {...form.register("couponCode")} /><Button type="button" variant="outline" disabled={couponMutation.isPending || !couponCode.trim()} onClick={() => void applyCoupon()}><Tag className="size-4" aria-hidden />{couponMutation.isPending ? t("applying") : t("apply")}</Button></div>{coupon ? <p className={`mt-2 text-sm ${coupon.valid ? "text-success" : "text-danger"}`}>{coupon.valid ? t("discountApplied", { percent: coupon.percent }) : t("discountInvalid")}</p> : <p className="text-prose-muted mt-2 text-xs">{t("discountDemoHint")}</p>}</section>
  </form></GlassPanel><GlassPanel className="p-6 lg:sticky lg:top-28"><p className="text-primary text-xs font-bold uppercase tracking-[0.14em]">{t("summary")}</p><h2 className="font-heading text-prose mt-2 text-2xl font-semibold">{localizedName(event.name, loc)}</h2><p className="text-prose-muted mt-1 flex items-center gap-2 text-sm"><MapPin className="size-4" aria-hidden />{localizedName(event.venue, loc)}</p><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-3"><dt className="text-prose-muted">{t("session")}</dt><dd className="text-prose text-end font-medium">{session ? `${formatMediumDate(session.date, loc)} · ${session.startsAt}` : t("notSelected")}</dd></div><div className="flex justify-between gap-3"><dt className="text-prose-muted">{t("tier")}</dt><dd className="text-prose font-medium">{tier ? tt(tier.id) : t("notSelected")}</dd></div><div className="flex justify-between gap-3"><dt className="text-prose-muted">{t("quantity")}</dt><dd className="text-prose font-medium">{quantity}</dd></div></dl><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-3"><dt className="text-prose-muted">{t("listPrice")}</dt><dd className="text-prose font-medium">{formatSyp(listPriceSyp, loc)}</dd></div>{discountSyp > 0 ? <div className="text-primary flex justify-between gap-3"><dt>{t("discount")}</dt><dd>− {formatSyp(discountSyp, loc)}</dd></div> : null}<div className="border-border flex justify-between gap-3 border-t pt-4"><dt className="text-prose font-semibold">{t("cashDue")}</dt><dd className="text-prose text-end font-semibold">{formatSyp(cashDueSyp, loc)}</dd></div></dl><p className="text-prose-muted mt-4 flex gap-2 text-xs leading-relaxed"><ShieldCheck className="text-primary size-4 shrink-0" aria-hidden />{t("cashDueHint")}</p><Button type="submit" className="mt-6 w-full" disabled={createBooking.isPending || !session || !tier || tier.remaining < quantity} onClick={() => void form.handleSubmit(onSubmit)()}>{createBooking.isPending ? t("confirming") : t("confirm")}</Button><Button href={`/events/${event.id}`} variant="glass" className="mt-3 w-full"><ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />{t("backToEvent")}</Button></GlassPanel></div>;
}
