"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import type { CouponResult } from "@/lib/mock/bookings";

type BookingCouponFeedbackProps = {
  coupon: CouponResult | null;
  formatMoney: (amountSyp: number) => string;
};

export function BookingCouponFeedback({
  coupon,
  formatMoney,
}: BookingCouponFeedbackProps): ReactNode {
  const t = useTranslations("bookingCoupon");

  if (!coupon) {
    return <p className="text-prose-muted mt-2 text-xs">{t("hint")}</p>;
  }

  if (!coupon.valid) {
    return <p className="text-destructive mt-2 text-sm">{t(`errors.${coupon.reason}`)}</p>;
  }

  const discount = coupon.discountKind === "percent"
    ? t("percentValue", { value: coupon.discountValue })
    : formatMoney(coupon.discountValue);

  return <p className="text-primary mt-2 text-sm">{t("applied", { discount })}</p>;
}
