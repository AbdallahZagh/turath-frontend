"use client";

import {
  ArrowRight,
  CheckCircle2,
  Download,
  Printer,
  TicketCheck,
  type LucideIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";

const BookingQr = dynamic(
  () => import("qrcode.react").then((module) => module.QRCodeSVG),
  { ssr: false, loading: () => <Skeleton className="size-36 rounded-lg" /> },
);

export type BookingPassPoint = {
  label: string;
  value: string;
  detail?: string;
};

export type BookingPassFact = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
};

export type BookingPassDiscount = {
  label: string;
  value: string;
};

type UniversalBookingPassProps = {
  pageEyebrow: string;
  pageTitle: string;
  pageDescription: string;
  passLabel: string;
  downloadLabel: string;
  printLabel: string;
  logoAlt: string;
  statusLabel: string;
  referenceLabel: string;
  reference: string;
  providerName: string;
  providerAddress: string;
  start: BookingPassPoint;
  end: BookingPassPoint;
  routeLabel: string;
  routeValue: string;
  facts: BookingPassFact[];
  listPriceLabel: string;
  listPrice: string;
  discount?: BookingPassDiscount;
  totalLabel: string;
  total: string;
  totalHint: string;
  qrValue: string;
  qrTitle: string;
  qrHint: string;
  backupLabel: string;
  backupCode: string;
  backupHint: string;
};

function TicketBarcode(): ReactNode {
  return (
    <span
      aria-hidden
      className="block h-7 w-28 opacity-45"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, var(--prose) 0 1px, transparent 1px 3px, var(--prose) 3px 5px, transparent 5px 8px)",
      }}
    />
  );
}

export function UniversalBookingPass({
  pageEyebrow,
  pageTitle,
  pageDescription,
  passLabel,
  downloadLabel,
  printLabel,
  logoAlt,
  statusLabel,
  referenceLabel,
  reference,
  providerName,
  providerAddress,
  start,
  end,
  routeLabel,
  routeValue,
  facts,
  listPriceLabel,
  listPrice,
  discount,
  totalLabel,
  total,
  totalHint,
  qrValue,
  qrTitle,
  qrHint,
  backupLabel,
  backupCode,
  backupHint,
}: UniversalBookingPassProps): ReactNode {
  function downloadQr(): void {
    const svg = document.getElementById("booking-pass-qr");
    if (!(svg instanceof SVGElement)) return;

    const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
      type: "image/svg+xml",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${reference}-qr.svg`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between print:hidden">
        <div>
          <p className="text-primary text-xs font-bold uppercase tracking-[0.18em]">
            {pageEyebrow}
          </p>
          <h1 className="font-heading text-prose mt-2 text-3xl font-semibold sm:text-4xl">
            {pageTitle}
          </h1>
          <p className="text-prose-muted mt-2 max-w-2xl text-sm leading-relaxed">
            {pageDescription}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="glass" size="sm" onClick={downloadQr}>
            <Download className="size-4" aria-hidden />
            {downloadLabel}
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="size-4" aria-hidden />
            {printLabel}
          </Button>
        </div>
      </div>

      <article className="relative overflow-hidden rounded-[1.5rem] border border-border bg-surface shadow-[0_2rem_5rem_-2.25rem_var(--prose-muted)] print:rounded-none print:border-black print:bg-white print:shadow-none">
        <div className="bg-primary text-primary-foreground flex min-h-11 items-center justify-between gap-4 px-6 py-2.5 sm:px-8">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em]">
            <TicketCheck className="size-4" aria-hidden />
            {passLabel}
          </p>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]">
            <CheckCircle2 className="size-4" aria-hidden />
            {statusLabel}
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_17.5rem]">
          <section className="order-2 flex min-w-0 flex-col lg:order-1">
            <header className="grid gap-5 border-b border-dashed border-border px-6 py-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:px-8">
              <div className="rounded-xl bg-white px-3 py-2 shadow-sm dark:bg-white">
                <Image
                  src="/reciept-logo.png"
                  alt={logoAlt}
                  width={965}
                  height={408}
                  priority
                  className="h-auto w-32 object-contain sm:w-36"
                />
              </div>

              <div className="sm:text-center">
                <p className="font-heading text-prose text-xl font-semibold">{providerName}</p>
                <p className="text-prose-muted mt-0.5 text-xs">{providerAddress}</p>
              </div>

              <div className="sm:text-end">
                <p className="text-prose-muted text-[0.62rem] font-bold uppercase tracking-[0.14em]">
                  {referenceLabel}
                </p>
                <p className="text-prose mt-1 font-mono text-sm font-bold tracking-[0.08em]">
                  {reference}
                </p>
              </div>
            </header>

            <div className="px-6 py-6 sm:px-8">
              <div className="grid grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_9rem_minmax(0,1fr)] sm:gap-5">
                <div>
                  <p className="text-prose-muted text-[0.65rem] font-bold uppercase tracking-[0.18em]">
                    {start.label}
                  </p>
                  <p className="font-heading text-prose mt-1.5 text-xl font-semibold sm:text-3xl">
                    {start.value}
                  </p>
                  {start.detail ? <p className="text-prose-muted mt-1 text-xs">{start.detail}</p> : null}
                </div>

                <div className="flex items-center" aria-hidden>
                  <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="border-primary/45 w-full border-t border-dashed" />
                  <span className="border-primary text-primary grid size-8 shrink-0 place-items-center rounded-full border">
                    <ArrowRight className="size-4 rtl:rotate-180" />
                  </span>
                  <span className="border-primary/45 w-full border-t border-dashed" />
                  <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                </div>

                <div className="text-end">
                  <p className="text-prose-muted text-[0.65rem] font-bold uppercase tracking-[0.18em]">
                    {end.label}
                  </p>
                  <p className="font-heading text-prose mt-1.5 text-xl font-semibold sm:text-3xl">
                    {end.value}
                  </p>
                  {end.detail ? <p className="text-prose-muted mt-1 text-xs">{end.detail}</p> : null}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2">
                <TicketCheck className="text-primary size-4" aria-hidden />
                <p className="text-prose-muted text-[0.68rem] font-bold uppercase tracking-[0.12em]">
                  {routeLabel}: <span className="text-prose">{routeValue}</span>
                </p>
              </div>
            </div>

            <dl className="grid border-y border-dashed border-border sm:grid-cols-3">
              {facts.map(({ icon: Icon, label, value }, index) => (
                <div
                  key={label}
                  className={cn(
                    "flex items-center gap-3 px-6 py-4 sm:px-5",
                    index > 0 && "border-t border-border sm:border-s sm:border-t-0",
                  )}
                >
                  <span className="bg-primary/10 text-primary grid size-9 shrink-0 place-items-center rounded-xl">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-prose-muted text-[0.62rem] font-bold uppercase tracking-[0.14em]">
                      {label}
                    </dt>
                    <dd className="text-prose mt-0.5 truncate text-sm font-semibold">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="grid flex-1 gap-4 bg-app-muted/35 px-6 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-8">
              <div className="flex items-end gap-5">
                <dl className="min-w-0 flex-1 space-y-1.5 text-xs">
                  <div className="flex justify-between gap-4">
                    <dt className="text-prose-muted">{listPriceLabel}</dt>
                    <dd className="text-prose font-medium">{listPrice}</dd>
                  </div>
                  {discount ? (
                    <div className="text-primary flex justify-between gap-4">
                      <dt>{discount.label}</dt>
                      <dd>− {discount.value}</dd>
                    </div>
                  ) : null}
                </dl>
                <TicketBarcode />
              </div>

              <div className="border-border sm:border-s sm:ps-5 sm:text-end">
                <p className="text-prose-muted text-[0.65rem] font-bold uppercase tracking-[0.14em]">
                  {totalLabel}
                </p>
                <p className="text-prose mt-1 text-xl font-bold">{total}</p>
                <p className="text-prose-muted mt-0.5 max-w-64 text-[0.65rem] leading-relaxed">
                  {totalHint}
                </p>
              </div>
            </div>
          </section>

          <aside className="relative order-1 flex flex-col items-center border-b border-dashed border-border bg-app-muted/45 px-6 py-5 text-center lg:order-2 lg:border-b-0 lg:border-s">
            <span className="absolute -top-3 size-6 rounded-full bg-app lg:-start-3" aria-hidden />
            <span className="absolute -bottom-3 hidden size-6 rounded-full bg-app lg:-start-3 lg:block" aria-hidden />

            <p className="text-prose-muted text-[0.62rem] uppercase tracking-[0.12em]">
              {referenceLabel}
            </p>
            <p className="text-prose mt-0.5 font-mono text-sm font-bold tracking-[0.08em]">
              {reference}
            </p>

            <div className="mt-3 rounded-xl border border-border bg-white p-2.5 shadow-sm">
              <BookingQr id="booking-pass-qr" value={qrValue} size={136} level="M" />
            </div>
            <p className="text-prose mt-2.5 text-xs font-semibold">{qrTitle}</p>
            <p className="text-prose-muted mt-1 max-w-52 text-[0.65rem] leading-relaxed">{qrHint}</p>

            <div className="mt-3 w-full border-t border-dashed border-border pt-3">
              <p className="text-prose-muted text-[0.6rem] font-bold uppercase tracking-[0.14em]">
                {backupLabel}
              </p>
              <code className="text-prose mt-1.5 block font-mono text-xl font-bold tracking-[0.22em]">
                {backupCode}
              </code>
              <p className="text-prose-muted mt-1 text-[0.62rem] leading-relaxed">{backupHint}</p>
            </div>

            <div className="mt-auto flex items-end justify-center gap-3 pt-4">
              <TicketBarcode />
              <span className="text-prose-muted font-mono text-[0.58rem] [writing-mode:vertical-rl]">
                {reference}
              </span>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
