"use client";

import { Tag } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type BookingCouponFieldProps = {
  label: string;
  placeholder: string;
  applyLabel: string;
  disabled: boolean;
  onApply: () => void;
  field: UseFormRegisterReturn<"couponCode">;
};

/** Discount code with Apply beside it, bottom-aligned so the button lines up with the field (both are the md control height). */
export function BookingCouponField({
  label,
  placeholder,
  applyLabel,
  disabled,
  onApply,
  field,
}: BookingCouponFieldProps) {
  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
      <Input variant="main" label={label} placeholder={placeholder} className="flex-1" {...field} />
      <Button
        type="button"
        variant="outline"
        className="sm:shrink-0"
        disabled={disabled}
        onClick={onApply}
      >
        <Tag className="size-4" aria-hidden />
        {applyLabel}
      </Button>
    </div>
  );
}
