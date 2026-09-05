"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";

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
  PROMOTION_KINDS,
  PROMOTION_TARGET_PRESETS,
  promotionPresetIdForTarget,
  type AdminPromotion,
  type PromotionKind,
} from "@/lib/mock/adminPromotions";
import { toast } from "@/store/toastStore";

type AdminPromotionModalProps = {
  open: boolean;
  promotion: AdminPromotion | null;
  onClose: () => void;
};

function isKind(value: string): value is PromotionKind {
  return (PROMOTION_KINDS as readonly string[]).includes(value);
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
      className="flex max-w-lg flex-col"
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
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";

  const savePromotion = useSaveAdminPromotion();
  const deletePromotion = useDeleteAdminPromotion();

  const [titleEn, setTitleEn] = useState(promotion?.title.en ?? "");
  const [titleAr, setTitleAr] = useState(promotion?.title.ar ?? "");
  const [kind, setKind] = useState<PromotionKind>(promotion?.kind ?? "featured");
  const [targetPreset, setTargetPreset] = useState(
    promotion ? promotionPresetIdForTarget(promotion.target) : CUSTOM_PROMOTION_TARGET_ID,
  );
  const [targetEn, setTargetEn] = useState(promotion?.target.en ?? "");
  const [targetAr, setTargetAr] = useState(promotion?.target.ar ?? "");
  const [startAt, setStartAt] = useState(promotion?.startAt ?? "");
  const [endAt, setEndAt] = useState(promotion?.endAt ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handlePresetChange(val: string): void {
    setTargetPreset(val);
    const match = PROMOTION_TARGET_PRESETS.find((preset) => preset.id === val);
    if (match) {
      setTargetEn(match.target.en);
      setTargetAr(match.target.ar);
    }
  }

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

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!startAt || !endAt || endAt < startAt) {
      toast.error(t("saveFailed"), t("invalidDates"));
      return;
    }

    savePromotion.mutate(
      {
        id: promotion?.id,
        input: {
          title: { en: titleEn, ar: titleAr },
          kind,
          target: { en: targetEn, ar: targetAr },
          startAt,
          endAt,
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
        onError: () => {
          toast.error(t("saveFailed"), t("saveFailedBody"));
        },
      },
    );
  }

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
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
        <div className="flex flex-col gap-1.5">
          <span className="text-prose-muted text-xs font-medium">{t("form.kind")}</span>
          <Select
            variant="glass"
            size="sm"
            value={kind}
            onChange={(value) => {
              if (isKind(value)) {
                setKind(value);
              }
            }}
            label={t("form.kind")}
            options={PROMOTION_KINDS.map((value) => ({
              value,
              label: t(`kind.${value}`),
            }))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-prose-muted text-xs font-medium">{t("form.targetPreset")}</span>
          <Select
            variant="glass"
            size="sm"
            value={targetPreset}
            onChange={handlePresetChange}
            label={t("form.targetPreset")}
            options={[
              { value: CUSTOM_PROMOTION_TARGET_ID, label: t("form.customTarget") },
              ...PROMOTION_TARGET_PRESETS.map((preset) => ({
                value: preset.id,
                label: loc === "ar" ? preset.target.ar : preset.target.en,
              })),
            ]}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-prose-muted text-xs font-medium">{t("form.targetEn")}</span>
            <Input
              variant="glass"
              size="sm"
              required
              value={targetEn}
              onChange={(event) => setTargetEn(event.target.value)}
              label={t("form.targetEn")}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-prose-muted text-xs font-medium">{t("form.targetAr")}</span>
            <Input
              variant="glass"
              size="sm"
              required
              dir="rtl"
              value={targetAr}
              onChange={(event) => setTargetAr(event.target.value)}
              label={t("form.targetAr")}
            />
          </label>
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
        <div className="flex shrink-0 items-center justify-between gap-2 pt-2 border-t border-glass-border">
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
