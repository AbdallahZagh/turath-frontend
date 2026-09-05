"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { FIELD_BASE, FIELD_VARIANT, SELECT_TRIGGER } from "@/components/ui/controlClasses";
import { controlStyle } from "@/components/ui/controlScale";
import { DatePicker } from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/cn";
import { useSaveAdminCoupon } from "@/hooks/useAdminCoupons";
import type { Locale } from "@/i18n/config";
import { localizedName } from "@/lib/i18n/localized";
import { COMMISSION_PILLARS } from "@/lib/mock/adminCommissions";
import {
  COUPON_DISCOUNT_KINDS,
  COUPON_SCOPES,
  DuplicateCouponCodeError,
  couponProviderOptions,
  isCouponDiscountKind,
  isCouponScope,
  listCouponListings,
  normalizeCouponCode,
  type AdminCoupon,
  type CouponDiscountKind,
  type CouponScope,
} from "@/lib/mock/adminCoupons";
import { toast } from "@/store/toastStore";

type AdminCouponModalProps = {
  open: boolean;
  coupon: AdminCoupon | null;
  onClose: () => void;
};

const CODE_PATTERN = /^[A-Z0-9]{3,16}$/;

function parseOptionalCount(value: string): number | null | "invalid" {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return "invalid";
  }
  return parsed;
}

export function AdminCouponModal({
  open,
  coupon,
  onClose,
}: AdminCouponModalProps): ReactNode {
  const t = useTranslations("admin.coupons");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={coupon ? t("form.titleEdit") : t("form.titleAdd")}
      className="flex max-h-[min(92vh,44rem)] max-w-lg flex-col overflow-hidden"
    >
      {open ? (
        <CouponForm key={coupon?.id ?? "new"} coupon={coupon} onClose={onClose} />
      ) : null}
    </Modal>
  );
}

type CouponFormProps = {
  coupon: AdminCoupon | null;
  onClose: () => void;
};

function CouponForm({ coupon, onClose }: CouponFormProps): ReactNode {
  const t = useTranslations("admin.coupons");
  const tPillars = useTranslations("admin.overview.pillars");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const saveCoupon = useSaveAdminCoupon();
  const listings = listCouponListings();
  const providers = couponProviderOptions();

  const [titleEn, setTitleEn] = useState(coupon?.title.en ?? "");
  const [titleAr, setTitleAr] = useState(coupon?.title.ar ?? "");
  const [code, setCode] = useState(coupon?.code ?? "");
  const [discountKind, setDiscountKind] = useState<CouponDiscountKind>(
    coupon?.discountKind ?? "percent",
  );
  const [discountValue, setDiscountValue] = useState(
    coupon ? String(coupon.discountValue) : "",
  );
  const [scope, setScope] = useState<CouponScope>(coupon?.scope ?? "platform");
  const [scopeId, setScopeId] = useState(coupon?.scopeId ?? "");
  const [startAt, setStartAt] = useState(coupon?.startAt ?? "");
  const [endAt, setEndAt] = useState(coupon?.endAt ?? "");
  const [maxRedemptions, setMaxRedemptions] = useState(
    coupon?.maxRedemptions != null ? String(coupon.maxRedemptions) : "",
  );
  const [perGuestCap, setPerGuestCap] = useState(
    coupon?.perGuestCap != null ? String(coupon.perGuestCap) : "",
  );
  const [enabled, setEnabled] = useState(coupon?.enabled ?? true);

  function dismiss(): void {
    saveCoupon.reset();
    onClose();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const normalizedCode = normalizeCouponCode(code);
    if (!CODE_PATTERN.test(normalizedCode)) {
      toast.error(t("saveFailed"), t("invalidCode"));
      return;
    }
    if (!startAt || !endAt || endAt < startAt) {
      toast.error(t("saveFailed"), t("invalidDates"));
      return;
    }

    const amount = Number(discountValue);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error(t("saveFailed"), t("invalidDiscount"));
      return;
    }
    if (discountKind === "percent" && (!Number.isInteger(amount) || amount > 100)) {
      toast.error(t("saveFailed"), t("invalidDiscount"));
      return;
    }
    if (discountKind === "fixed" && !Number.isInteger(amount)) {
      toast.error(t("saveFailed"), t("invalidDiscount"));
      return;
    }

    const nextScopeId = scope === "platform" ? null : scopeId;
    if (scope !== "platform" && !nextScopeId) {
      toast.error(t("saveFailed"), t("invalidScope"));
      return;
    }

    const redemptions = parseOptionalCount(maxRedemptions);
    const guestCap = parseOptionalCount(perGuestCap);
    if (redemptions === "invalid" || guestCap === "invalid") {
      toast.error(t("saveFailed"), t("invalidCaps"));
      return;
    }

    saveCoupon.mutate(
      {
        id: coupon?.id,
        input: {
          title: { en: titleEn, ar: titleAr },
          code: normalizedCode,
          discountKind,
          discountValue: amount,
          scope,
          scopeId: nextScopeId,
          startAt,
          endAt,
          maxRedemptions: redemptions,
          perGuestCap: guestCap,
          enabled,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            coupon ? t("updated") : t("created"),
            coupon ? t("updatedBody") : t("createdBody"),
          );
          onClose();
        },
        onError: (error) => {
          if (error instanceof DuplicateCouponCodeError) {
            toast.error(t("saveFailed"), t("duplicateCode"));
            return;
          }
          toast.error(t("saveFailed"), t("saveFailedBody"));
        },
      },
    );
  }

  const scopeOptions =
    scope === "pillar"
      ? COMMISSION_PILLARS.map((value) => ({
          value,
          label: tPillars(value),
        }))
      : scope === "provider"
        ? providers.map((row) => ({
            value: row.id,
            label: localizedName(row.name, loc),
          }))
        : listings.map((row) => ({
            value: row.id,
            label: localizedName(row.name, loc),
          }));

  return (
    <form className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden" onSubmit={onSubmit}>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pe-1">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-prose-muted text-xs font-medium">{t("form.titleEn")}</span>
            <Input
              variant="glass"
              size="sm"
              required
              value={titleEn}
              onChange={(event) => setTitleEn(event.target.value)}
              label={t("form.titleEn")}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-prose-muted text-xs font-medium">{t("form.titleAr")}</span>
            <Input
              variant="glass"
              size="sm"
              required
              dir="rtl"
              value={titleAr}
              onChange={(event) => setTitleAr(event.target.value)}
              label={t("form.titleAr")}
            />
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-prose-muted text-xs font-medium">{t("form.code")}</span>
          <Input
            variant="glass"
            size="sm"
            required
            value={code}
            onChange={(event) => setCode(normalizeCouponCode(event.target.value))}
            label={t("form.code")}
            autoCapitalize="characters"
            spellCheck={false}
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <span className="text-prose-muted text-xs font-medium">{t("form.discountKind")}</span>
            <Select
              variant="glass"
              size="sm"
              value={discountKind}
              onChange={(value) => {
                if (isCouponDiscountKind(value)) {
                  setDiscountKind(value);
                }
              }}
              label={t("form.discountKind")}
              options={COUPON_DISCOUNT_KINDS.map((value) => ({
                value,
                label: t(`discountKind.${value}`),
              }))}
            />
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-prose-muted text-xs font-medium">
              {discountKind === "percent" ? t("form.percent") : t("form.fixed")}
            </span>
            <Input
              variant="glass"
              size="sm"
              required
              type="number"
              min={1}
              max={discountKind === "percent" ? 100 : undefined}
              step={1}
              value={discountValue}
              onChange={(event) => setDiscountValue(event.target.value)}
              label={discountKind === "percent" ? t("form.percent") : t("form.fixed")}
            />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <span className="text-prose-muted text-xs font-medium">{t("form.scope")}</span>
            <Select
              variant="glass"
              size="sm"
              value={scope}
              onChange={(value) => {
                if (!isCouponScope(value)) {
                  return;
                }
                setScope(value);
                setScopeId("");
              }}
              label={t("form.scope")}
              options={COUPON_SCOPES.map((value) => ({
                value,
                label: t(`scope.${value}`),
              }))}
            />
          </div>
          {scope === "platform" ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-prose-muted text-xs font-medium">{t("form.scopeTarget")}</span>
              <p className="text-prose-muted border-glass-border bg-glass-control flex min-h-9 items-center rounded-lg border px-3 text-sm">
                {t("scope.platformHint")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <span className="text-prose-muted text-xs font-medium">{t("form.scopeTarget")}</span>
              <Select
                variant="glass"
                size="sm"
                value={scopeId}
                onChange={setScopeId}
                label={t("form.scopeTarget")}
                options={scopeOptions}
                placeholder={t("form.scopeTargetPlaceholder")}
                searchable={scope === "provider"}
                required
              />
            </div>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <DatePicker
            variant="glass"
            size="sm"
            required
            value={startAt}
            onChange={setStartAt}
            label={t("form.start")}
            max={endAt || undefined}
          />
          <DatePicker
            variant="glass"
            size="sm"
            required
            value={endAt}
            onChange={setEndAt}
            label={t("form.end")}
            min={startAt || undefined}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-prose-muted text-xs font-medium">{t("form.maxRedemptions")}</span>
            <Input
              variant="glass"
              size="sm"
              type="number"
              min={1}
              step={1}
              value={maxRedemptions}
              onChange={(event) => setMaxRedemptions(event.target.value)}
              label={t("form.maxRedemptions")}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-prose-muted text-xs font-medium">{t("form.perGuestCap")}</span>
            <Input
              variant="glass"
              size="sm"
              type="number"
              min={1}
              step={1}
              value={perGuestCap}
              onChange={(event) => setPerGuestCap(event.target.value)}
              label={t("form.perGuestCap")}
            />
          </label>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-prose-muted text-xs font-medium">{t("form.enabled")}</span>
          <div
            className={cn(FIELD_BASE, FIELD_VARIANT.glass, SELECT_TRIGGER, "w-full")}
            style={controlStyle({ size: "sm", defaultRadius: "0.5rem" })}
          >
            <span className="min-w-0 flex-1 truncate">
              {enabled ? t("form.enabledOn") : t("form.enabledOff")}
            </span>
            <Switch
              size="sm"
              compact
              checked={enabled}
              onChange={(event) => setEnabled(event.target.checked)}
              aria-label={t("form.enabled")}
            />
          </div>
        </div>
      </div>
      <div className="flex shrink-0 justify-end gap-2 pt-1">
        <Button type="button" variant="glass" size="sm" onClick={dismiss}>
          {t("form.cancel")}
        </Button>
        <Button type="submit" size="sm" disabled={saveCoupon.isPending}>
          {t("form.save")}
        </Button>
      </div>
    </form>
  );
}
