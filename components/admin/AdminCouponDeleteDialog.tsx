"use client";

import { Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useDeleteAdminCoupon } from "@/hooks/useAdminCoupons";
import type { Locale } from "@/i18n/config";
import { localizedName } from "@/lib/i18n/localized";
import type { AdminCoupon } from "@/lib/mock/adminCoupons";
import { toast } from "@/store/toastStore";

type AdminCouponDeleteDialogProps = {
  coupon: AdminCoupon | null;
  onClose: () => void;
};

export function AdminCouponDeleteDialog({
  coupon,
  onClose,
}: AdminCouponDeleteDialogProps): ReactNode {
  const t = useTranslations("admin.coupons");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const otherLocale: Locale = locale === "ar" ? "en" : "ar";
  const deleteCoupon = useDeleteAdminCoupon();

  const primaryName = coupon ? localizedName(coupon.title, loc) : "";
  const secondaryName = coupon ? localizedName(coupon.title, otherLocale) : "";

  function onConfirm(): void {
    if (!coupon) {
      return;
    }

    deleteCoupon.mutate(coupon.id, {
      onSuccess: () => {
        toast.success(t("deleted"), t("deletedBody"));
        onClose();
      },
      onError: () => {
        toast.error(t("deleteFailed"), t("deleteFailedBody"));
      },
    });
  }

  return (
    <ConfirmDialog
      open={Boolean(coupon)}
      onClose={onClose}
      onConfirm={onConfirm}
      title={t("deleteConfirmTitle")}
      description={t("deleteConfirmBody")}
      confirmLabel={t("deleteConfirmButton")}
      cancelLabel={t("form.cancel")}
      pending={deleteCoupon.isPending}
      icon={Trash2}
    >
      {coupon ? (
        <div className="border-glass-border bg-glass-control rounded-2xl border p-2.5">
          <p className="text-prose truncate text-sm font-semibold">{primaryName}</p>
          {secondaryName !== primaryName ? (
            <p className="text-prose-muted truncate text-xs">{secondaryName}</p>
          ) : null}
          <p className="text-prose-muted mt-1 font-mono text-xs tracking-wide">{coupon.code}</p>
        </div>
      ) : null}
    </ConfirmDialog>
  );
}
