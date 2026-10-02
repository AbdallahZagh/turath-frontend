"use client";

import { ArrowLeft, ShieldCheck, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Icon } from "@/components/ui/Icon";

export type BookingSummaryRow = { id: string; label: string; value: ReactNode; icon?: LucideIcon };

type LabelledValue = { label: string; value: ReactNode };

type ConfirmAction = { label: string; disabled: boolean; onClick: () => void };

type BookingSummaryCardProps = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  rows: BookingSummaryRow[];
  listPrice: LabelledValue;
  /** Only when a code took money off. */
  discount: LabelledValue | null;
  cashDue: LabelledValue;
  /** Shown under the totals until the price can be worked out ("Choose a room to see the price"). */
  priceHint: string | null;
  cashDueHint: string;
  confirm: ConfirmAction;
  back: { href: string; label: string };
};

/**
 * The one booking summary every checkout uses: category icon with the name and address, the
 * chosen details between two dividers, the totals, and Confirm. Below `lg` Confirm lives in
 * `BookingConfirmBar`, so the card shows it on wide screens only.
 */
export function BookingSummaryCard({
  icon: CategoryIcon,
  title,
  subtitle,
  rows,
  listPrice,
  discount,
  cashDue,
  priceHint,
  cashDueHint,
  confirm,
  back,
}: BookingSummaryCardProps) {
  return (
    <GlassPanel className="p-6 lg:sticky lg:top-28">
      <div className="flex items-center gap-3">
        <span className="bg-primary/12 text-primary grid size-11 shrink-0 place-items-center rounded-xl">
          <CategoryIcon className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="text-prose font-semibold">
            <bdi>{title}</bdi>
          </h2>
          <p className="text-prose-muted text-xs">{subtitle}</p>
        </div>
      </div>
      <dl className="border-border mt-5 space-y-3 border-y py-5 text-sm">
        {rows.map(({ id, label, value, icon: RowIcon }) => (
          <div key={id} className="flex justify-between gap-3">
            <dt className="text-prose-muted flex shrink-0 items-center gap-2">
              {RowIcon ? <RowIcon className="size-4" aria-hidden /> : null}
              {label}
            </dt>
            <dd className="text-prose text-end font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-prose-muted">{listPrice.label}</dt>
          <dd className="text-prose text-end font-medium">{listPrice.value}</dd>
        </div>
        {discount ? (
          <div className="text-primary flex justify-between gap-3">
            <dt>{discount.label}</dt>
            <dd className="text-end">{discount.value}</dd>
          </div>
        ) : null}
        <div className="border-border flex justify-between gap-3 border-t pt-4">
          <dt className="text-prose font-semibold">{cashDue.label}</dt>
          <dd className="text-prose text-end font-semibold">{cashDue.value}</dd>
        </div>
      </dl>
      {priceHint ? <p className="text-prose-muted mt-3 text-xs">{priceHint}</p> : null}
      <p className="text-prose-muted mt-4 flex gap-2 text-xs leading-relaxed">
        <ShieldCheck className="text-primary size-4 shrink-0" aria-hidden />
        {cashDueHint}
      </p>
      <Button
        type="submit"
        className="mt-6 hidden w-full lg:inline-flex"
        disabled={confirm.disabled}
        onClick={confirm.onClick}
      >
        {confirm.label}
      </Button>
      <Button href={back.href} variant="glass" className="mt-3 w-full">
        <Icon icon={ArrowLeft} className="size-4" aria-hidden />
        {back.label}
      </Button>
    </GlassPanel>
  );
}

type BookingConfirmBarProps = {
  cashDue: LabelledValue;
  priceHint: string | null;
  confirm: ConfirmAction;
};

/** Below `lg`: the amount due and Confirm stay pinned to the bottom of the screen. */
export function BookingConfirmBar({ cashDue, priceHint, confirm }: BookingConfirmBarProps) {
  return (
    <div className="border-border bg-surface/95 supports-[backdrop-filter]:bg-surface/80 fixed inset-x-0 bottom-0 z-40 border-t px-4 py-3 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-[98rem] items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-prose-muted text-xs">{cashDue.label}</p>
          <p className="text-prose text-sm leading-tight font-semibold">{cashDue.value}</p>
          {priceHint ? <p className="text-prose-muted text-xs">{priceHint}</p> : null}
        </div>
        <Button
          type="submit"
          size="sm"
          className="shrink-0"
          disabled={confirm.disabled}
          onClick={confirm.onClick}
        >
          {confirm.label}
        </Button>
      </div>
    </div>
  );
}

/** Page grid for a checkout: form, summary, and room at the bottom for the confirm bar. */
export const CHECKOUT_GRID =
  "grid min-w-0 items-start gap-7 pb-24 lg:grid-cols-[minmax(0,1fr)_24rem] lg:pb-0";
