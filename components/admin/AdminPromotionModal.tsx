"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { Controller, useForm, type FieldError } from "react-hook-form";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import {
  useDeleteAdminPromotion,
  useSaveAdminPromotion,
} from "@/hooks/useAdminPromotions";
import type { Locale } from "@/i18n/config";
import {
  CUSTOM_PROMOTION_TARGET_ID,
  FEATURED_SLOT_IDS,
  FeaturedKindSlotMismatchError,
  FeaturedSlotAtCapacityError,
  FeaturedSlotDisabledError,
  PROMOTION_TARGET_PRESETS,
  promotionPresetIdForTarget,
  slotRequiresCampaign,
  type AdminPromotion,
  type FeaturedSlotId,
  type PromotionKind,
} from "@/lib/mock/adminPromotions";
import {
  featuredFormSchema,
  isFeaturedFormErrorKey,
  type FeaturedFormErrorKey,
  type FeaturedFormValues,
} from "@/lib/validation/adminFeatured";
import { toast } from "@/store/toastStore";

type AdminPromotionModalProps = {
  open: boolean;
  promotion: AdminPromotion | null;
  onClose: () => void;
};

function fieldMessage(
  tErrors: (key: FeaturedFormErrorKey) => string,
  error: FieldError | undefined,
): string | undefined {
  if (!error?.message) {
    return undefined;
  }
  if (!isFeaturedFormErrorKey(error.message)) {
    return error.message;
  }
  return tErrors(error.message);
}

function kindForSlot(slot: FeaturedSlotId): PromotionKind {
  return slotRequiresCampaign(slot) ? "campaign" : "featured";
}

export function AdminPromotionModal({
  open,
  promotion,
  onClose,
}: AdminPromotionModalProps): ReactNode {
  const t = useTranslations("admin.promotions");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={promotion ? t("form.titleEdit") : t("form.titleAdd")}
      className="flex max-h-[min(92vh,44rem)] max-w-lg flex-col overflow-hidden"
    >
      {open ? (
        <PromotionForm
          key={promotion?.id ?? "new"}
          promotion={promotion}
          onClose={onClose}
        />
      ) : null}
    </Modal>
  );
}

type PromotionFormProps = {
  promotion: AdminPromotion | null;
  onClose: () => void;
};

function PromotionForm({ promotion, onClose }: PromotionFormProps): ReactNode {
  const t = useTranslations("admin.promotions");
  const tErrors = useTranslations("admin.promotions.form.errors");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";

  const savePromotion = useSaveAdminPromotion();
  const deletePromotion = useDeleteAdminPromotion();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const form = useForm<FeaturedFormValues>({
    resolver: zodResolver(featuredFormSchema),
    defaultValues: {
      titleEn: promotion?.title.en ?? "",
      titleAr: promotion?.title.ar ?? "",
      slot: promotion?.slot ?? "heritage_spotlight",
      kind: promotion?.kind ?? "featured",
      targetPreset: promotion
        ? promotionPresetIdForTarget(promotion.target)
        : CUSTOM_PROMOTION_TARGET_ID,
      targetEn: promotion?.target.en ?? "",
      targetAr: promotion?.target.ar ?? "",
      startAt: promotion?.startAt ?? "",
      endAt: promotion?.endAt ?? "",
    },
  });

  function dismiss(): void {
    savePromotion.reset();
    onClose();
  }

  function handleDelete(): void {
    if (!promotion) return;
    deletePromotion.mutate(promotion.id, {
      onSuccess: () => {
        toast.success(t("deleted"), t("deletedBody"));
        setConfirmDelete(false);
        onClose();
      },
      onError: () => {
        toast.error(t("saveFailed"), t("saveFailedBody"));
      },
    });
  }

  function onValid(values: FeaturedFormValues): void {
    const slot = values.slot as FeaturedSlotId;
    savePromotion.mutate(
      {
        id: promotion?.id,
        input: {
          title: { en: values.titleEn, ar: values.titleAr },
          kind: kindForSlot(slot),
          slot,
          target: { en: values.targetEn, ar: values.targetAr },
          startAt: values.startAt,
          endAt: values.endAt,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            promotion ? t("updated") : t("created"),
            promotion ? t("updatedBody") : t("createdBody"),
          );
          onClose();
        },
        onError: (error) => {
          if (error instanceof FeaturedSlotDisabledError) {
            toast.error(t("slotDisabled"), t("slotDisabledBody"));
            return;
          }
          if (error instanceof FeaturedSlotAtCapacityError) {
            toast.error(t("slotAtCapacity"), t("slotAtCapacityBody"));
            return;
          }
          if (error instanceof FeaturedKindSlotMismatchError) {
            toast.error(t("saveFailed"), t("kindSlotMismatch"));
            return;
          }
          toast.error(t("saveFailed"), t("saveFailedBody"));
        },
      },
    );
  }

  return (
    <>
      <form
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pe-1"
        onSubmit={form.handleSubmit(onValid)}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-prose-muted text-xs font-medium">{t("form.titleEn")}</span>
            <Input
              variant="glass"
              size="sm"
              {...form.register("titleEn")}
              label={t("form.titleEn")}
              aria-invalid={Boolean(form.formState.errors.titleEn)}
            />
            {fieldMessage(tErrors, form.formState.errors.titleEn) ? (
              <span className="text-destructive text-xs">
                {fieldMessage(tErrors, form.formState.errors.titleEn)}
              </span>
            ) : null}
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-prose-muted text-xs font-medium">{t("form.titleAr")}</span>
            <Input
              variant="glass"
              size="sm"
              dir="rtl"
              {...form.register("titleAr")}
              label={t("form.titleAr")}
              aria-invalid={Boolean(form.formState.errors.titleAr)}
            />
            {fieldMessage(tErrors, form.formState.errors.titleAr) ? (
              <span className="text-destructive text-xs">
                {fieldMessage(tErrors, form.formState.errors.titleAr)}
              </span>
            ) : null}
          </label>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-prose-muted text-xs font-medium">{t("form.slot")}</span>
          <Controller
            control={form.control}
            name="slot"
            render={({ field }) => (
              <Select
                variant="glass"
                size="sm"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  if ((FEATURED_SLOT_IDS as readonly string[]).includes(value)) {
                    form.setValue("kind", kindForSlot(value as FeaturedSlotId));
                  }
                }}
                label={t("form.slot")}
                options={FEATURED_SLOT_IDS.map((slot) => ({
                  value: slot,
                  label: t(`slots.${slot}`),
                }))}
              />
            )}
          />
          {fieldMessage(tErrors, form.formState.errors.slot) ? (
            <span className="text-destructive text-xs">
              {fieldMessage(tErrors, form.formState.errors.slot)}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-prose-muted text-xs font-medium">{t("form.kind")}</span>
          <Controller
            control={form.control}
            name="kind"
            render={({ field }) => (
              <Select
                variant="glass"
                size="sm"
                value={field.value}
                onChange={field.onChange}
                label={t("form.kind")}
                disabled
                options={[
                  { value: "featured", label: t("kind.featured") },
                  { value: "campaign", label: t("kind.campaign") },
                ]}
              />
            )}
          />
          <p className="text-prose-muted text-xs">{t("form.kindHint")}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-prose-muted text-xs font-medium">{t("form.targetPreset")}</span>
          <Controller
            control={form.control}
            name="targetPreset"
            render={({ field }) => (
              <Select
                variant="glass"
                size="sm"
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  const match = PROMOTION_TARGET_PRESETS.find((preset) => preset.id === val);
                  if (match) {
                    form.setValue("targetEn", match.target.en);
                    form.setValue("targetAr", match.target.ar);
                  }
                }}
                label={t("form.targetPreset")}
                options={[
                  { value: CUSTOM_PROMOTION_TARGET_ID, label: t("form.customTarget") },
                  ...PROMOTION_TARGET_PRESETS.map((preset) => ({
                    value: preset.id,
                    label: loc === "ar" ? preset.target.ar : preset.target.en,
                  })),
                ]}
              />
            )}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-prose-muted text-xs font-medium">{t("form.targetEn")}</span>
            <Input
              variant="glass"
              size="sm"
              {...form.register("targetEn")}
              label={t("form.targetEn")}
              aria-invalid={Boolean(form.formState.errors.targetEn)}
            />
            {fieldMessage(tErrors, form.formState.errors.targetEn) ? (
              <span className="text-destructive text-xs">
                {fieldMessage(tErrors, form.formState.errors.targetEn)}
              </span>
            ) : null}
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-prose-muted text-xs font-medium">{t("form.targetAr")}</span>
            <Input
              variant="glass"
              size="sm"
              dir="rtl"
              {...form.register("targetAr")}
              label={t("form.targetAr")}
              aria-invalid={Boolean(form.formState.errors.targetAr)}
            />
            {fieldMessage(tErrors, form.formState.errors.targetAr) ? (
              <span className="text-destructive text-xs">
                {fieldMessage(tErrors, form.formState.errors.targetAr)}
              </span>
            ) : null}
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="startAt"
            render={({ field }) => (
              <DatePicker
                variant="glass"
                size="sm"
                value={field.value}
                onChange={field.onChange}
                label={t("form.start")}
                max={form.getValues("endAt") || undefined}
              />
            )}
          />
          <Controller
            control={form.control}
            name="endAt"
            render={({ field }) => (
              <DatePicker
                variant="glass"
                size="sm"
                value={field.value}
                onChange={field.onChange}
                label={t("form.end")}
                min={form.getValues("startAt") || undefined}
              />
            )}
          />
        </div>
        {fieldMessage(tErrors, form.formState.errors.endAt) ? (
          <span className="text-destructive text-xs">
            {fieldMessage(tErrors, form.formState.errors.endAt)}
          </span>
        ) : null}

        <div className="border-glass-border flex shrink-0 items-center justify-between gap-2 border-t pt-2">
          {promotion ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setConfirmDelete(true)}
              className="text-destructive border-destructive/30 hover:bg-destructive/10 flex items-center gap-1.5"
            >
              <Trash2 className="size-3.5" aria-hidden />
              <span>{t("form.delete")}</span>
            </Button>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            <Button type="button" variant="glass" size="sm" onClick={dismiss}>
              {t("form.cancel")}
            </Button>
            <Button type="submit" size="sm" disabled={savePromotion.isPending}>
              {t("form.save")}
            </Button>
          </div>
        </div>
      </form>

      {promotion ? (
        <ConfirmDialog
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          onConfirm={handleDelete}
          tone="destructive"
          title={t("deleteConfirmTitle")}
          description={t("deleteConfirmDescription")}
          confirmLabel={t("form.delete")}
          cancelLabel={t("form.cancel")}
          pending={deletePromotion.isPending}
        />
      ) : null}
    </>
  );
}
