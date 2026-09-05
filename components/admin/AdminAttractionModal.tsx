"use client";

import { useLocale, useTranslations } from "next-intl";
import { Plus, X } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { FIELD_BASE, FIELD_VARIANT, SELECT_TRIGGER } from "@/components/ui/controlClasses";
import { controlStyle } from "@/components/ui/controlScale";
import { ImageField } from "@/components/ui/ImageField";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { TimePicker } from "@/components/ui/TimePicker";
import { cn } from "@/lib/cn";
import { formatSyp } from "@/lib/format/money";
import type { AdminAttraction } from "@/lib/mock/adminAttractions";
import { GOVERNORATES, type GovernorateSlug } from "@/lib/mock/landing";
import { useCreateAdminAttraction, useUpdateAdminAttraction } from "@/hooks/useAdminAttractions";
import { toast } from "@/store/toastStore";

export type AdminAttractionModalProps = {
  open: boolean;
  onClose: () => void;
  attraction?: AdminAttraction | null;
  onSaved?: (attraction: AdminAttraction) => void;
};

const DEFAULT_GOVERNORATE: GovernorateSlug = "damascus";

export function AdminAttractionModal({
  open,
  onClose,
  attraction,
  onSaved,
}: AdminAttractionModalProps): ReactNode {
  const t = useTranslations("admin.attractions");
  const tGov = useTranslations("landing.governorates");
  const locale = useLocale();

  const isEditing = Boolean(attraction);
  const createAttraction = useCreateAdminAttraction();
  const updateAttraction = useUpdateAdminAttraction();

  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [narrativeEn, setNarrativeEn] = useState("");
  const [narrativeAr, setNarrativeAr] = useState("");
  const [governorate, setGovernorate] = useState<GovernorateSlug>(DEFAULT_GOVERNORATE);
  const [imageSrc, setImageSrc] = useState<string>();
  const [gallery, setGallery] = useState<string[]>([]);
  const [opensAt, setOpensAt] = useState("09:00");
  const [closesAt, setClosesAt] = useState("17:00");
  const [entryFeeSyp, setEntryFeeSyp] = useState("0");
  const [latitude, setLatitude] = useState("33.5138");
  const [longitude, setLongitude] = useState("36.2765");
  const [published, setPublished] = useState(true);
  const [imageError, setImageError] = useState(false);

  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever attraction or open status changes
  useEffect(() => {
    if (!open) return;

    if (attraction) {
      setNameEn(attraction.name.en);
      setNameAr(attraction.name.ar);
      setNarrativeEn(attraction.narrative.en);
      setNarrativeAr(attraction.narrative.ar);
      setGovernorate(attraction.governorate);
      setImageSrc(attraction.imageSrc);
      setGallery(attraction.gallery ? [...attraction.gallery] : []);
      setOpensAt(attraction.opensAt);
      setClosesAt(attraction.closesAt);
      setEntryFeeSyp(String(attraction.entryFeeSyp));
      setLatitude(String(attraction.latitude));
      setLongitude(String(attraction.longitude));
      setPublished(attraction.published);
      setImageError(false);
    } else {
      setNameEn("");
      setNameAr("");
      setNarrativeEn("");
      setNarrativeAr("");
      setGovernorate(DEFAULT_GOVERNORATE);
      setImageSrc(undefined);
      setGallery([]);
      setOpensAt("09:00");
      setClosesAt("17:00");
      setEntryFeeSyp("0");
      setLatitude("33.5138");
      setLongitude("36.2765");
      setPublished(true);
      setImageError(false);
    }
  }, [open, attraction]);

  function dismiss(): void {
    if (!attraction) {
      if (imageSrc?.startsWith("blob:")) {
        URL.revokeObjectURL(imageSrc);
      }
      gallery.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    }
    onClose();
  }

  function onCoverChange(_file: File | undefined, previewUrl: string | undefined): void {
    if (imageSrc?.startsWith("blob:") && (!attraction || imageSrc !== attraction.imageSrc)) {
      URL.revokeObjectURL(imageSrc);
    }
    setImageSrc(previewUrl);
    setImageError(false);
  }

  function onAddGalleryPhoto(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setGallery((prev) => [...prev, previewUrl]);

    if (galleryInputRef.current) {
      galleryInputRef.current.value = "";
    }
  }

  function onRemoveGalleryPhoto(index: number): void {
    const photoToRemove = gallery[index];
    if (photoToRemove?.startsWith("blob:")) {
      URL.revokeObjectURL(photoToRemove);
    }
    setGallery((prev) => prev.filter((_, i) => i !== index));
  }

  const numericFee = Number(entryFeeSyp);
  const formattedFeePreview =
    Number.isFinite(numericFee) && numericFee > 0 ? formatSyp(numericFee, locale) : t("free");

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!imageSrc) {
      setImageError(true);
      return;
    }

    const fee = Number(entryFeeSyp);
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!Number.isFinite(fee) || fee < 0 || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      toast.error(t("detail.invalid"), t("detail.saveFailedBody"));
      return;
    }

    const payload = {
      name: { en: nameEn.trim(), ar: nameAr.trim() },
      narrative: { en: narrativeEn.trim(), ar: narrativeAr.trim() },
      governorate,
      imageSrc,
      gallery,
      opensAt,
      closesAt,
      entryFeeSyp: fee,
      latitude: lat,
      longitude: lng,
      published,
    };

    if (isEditing && attraction) {
      updateAttraction.mutate(
        { id: attraction.id, input: payload },
        {
          onSuccess: (updated) => {
            toast.success(t("detail.saved"), t("detail.savedBody"));
            onSaved?.(updated);
            onClose();
          },
          onError: () => {
            toast.error(t("detail.saveFailed"), t("detail.saveFailedBody"));
          },
        },
      );
    } else {
      createAttraction.mutate(payload, {
        onSuccess: (created) => {
          toast.success(t("created"), t("createdBody"));
          onSaved?.(created);
          onClose();
        },
        onError: () => {
          toast.error(t("createFailed"), t("createFailedBody"));
        },
      });
    }
  }

  const isPending = createAttraction.isPending || updateAttraction.isPending;

  return (
    <Modal
      open={open}
      onClose={dismiss}
      title={isEditing ? t("form.editTitle") : t("form.addTitle")}
      className="flex max-h-[min(92vh,56rem)] max-w-3xl flex-col overflow-hidden"
    >
      <form
        className="flex max-h-[min(76vh,46rem)] flex-col gap-4 overflow-hidden"
        onSubmit={onSubmit}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pe-1">
          <div className="flex flex-col gap-3">
            <ImageField
              label={t("form.image")}
              hint={t("form.imageHint")}
              removeLabel={t("form.removeImage")}
              value={imageSrc}
              onChange={onCoverChange}
            />
            {imageError ? (
              <p className="text-destructive text-xs">{t("form.imageRequired")}</p>
            ) : null}

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-prose-muted text-xs font-medium">
                  {t("form.gallery")}
                </span>
                <span className="text-prose-muted text-xs">
                  {t("form.galleryHint")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {gallery.map((src, index) => (
                  <div
                    key={`${src}-${index}`}
                    className="border-glass-border relative aspect-video overflow-hidden rounded-xl border bg-ink/10"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveGalleryPhoto(index)}
                      className="bg-ink/80 text-foam hover:bg-destructive absolute inset-e-1 top-1 flex size-6 items-center justify-center rounded-full transition"
                      aria-label={t("form.removeImage")}
                    >
                      <X className="size-3.5" aria-hidden />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="border-glass-border bg-glass-control text-prose-muted hover:border-primary/60 hover:text-prose flex aspect-video flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed p-2 text-center text-xs transition"
                >
                  <Plus className="size-4" aria-hidden />
                  <span>{t("form.addPhoto")}</span>
                </button>
              </div>

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onAddGalleryPhoto}
              />
            </div>
          </div>

          <div className="border-glass-border/60 grid gap-3 border-t pt-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-prose-muted text-xs font-medium">{t("form.nameEn")}</span>
              <Input
                variant="glass"
                size="sm"
                required
                value={nameEn}
                onChange={(event) => setNameEn(event.target.value)}
                label={t("form.nameEn")}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-prose-muted text-xs font-medium">{t("form.nameAr")}</span>
              <Input
                variant="glass"
                size="sm"
                required
                dir="rtl"
                value={nameAr}
                onChange={(event) => setNameAr(event.target.value)}
                label={t("form.nameAr")}
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-prose-muted text-xs font-medium">{t("form.narrativeEn")}</span>
              <Textarea
                variant="glass"
                size="sm"
                rows={3}
                required
                value={narrativeEn}
                onChange={(event) => setNarrativeEn(event.target.value)}
                label={t("form.narrativeEn")}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-prose-muted text-xs font-medium">{t("form.narrativeAr")}</span>
              <Textarea
                variant="glass"
                size="sm"
                rows={3}
                required
                dir="rtl"
                value={narrativeAr}
                onChange={(event) => setNarrativeAr(event.target.value)}
                label={t("form.narrativeAr")}
              />
            </label>
          </div>

          <div className="border-glass-border/60 grid gap-3 border-t pt-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <span className="text-prose-muted text-xs font-medium">
                {t("columns.governorate")}
              </span>
              <Select
                variant="glass"
                size="sm"
                value={governorate}
                onChange={(value) => setGovernorate(value as GovernorateSlug)}
                label={t("columns.governorate")}
                options={GOVERNORATES.map((item) => ({
                  value: item.slug,
                  label: tGov(item.slug),
                }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-prose-muted text-xs font-medium">{t("form.published")}</span>
              <div
                className={cn(FIELD_BASE, FIELD_VARIANT.glass, SELECT_TRIGGER, "w-full")}
                style={controlStyle({ size: "sm", defaultRadius: "0.5rem" })}
              >
                <span className="min-w-0 flex-1 truncate">
                  {published ? t("status.published") : t("status.draft")}
                </span>
                <Switch
                  size="sm"
                  compact
                  checked={published}
                  onChange={(event) => setPublished(event.target.checked)}
                  aria-label={t("form.published")}
                />
              </div>
            </div>
          </div>

          <div className="border-glass-border/60 grid gap-3 border-t pt-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-prose-muted text-xs font-medium">{t("form.opensAt")}</span>
              <TimePicker
                variant="glass"
                size="sm"
                value={opensAt}
                onChange={setOpensAt}
                label={t("form.opensAt")}
                hourCycle="24"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-prose-muted text-xs font-medium">{t("form.closesAt")}</span>
              <TimePicker
                variant="glass"
                size="sm"
                value={closesAt}
                onChange={setClosesAt}
                label={t("form.closesAt")}
                hourCycle="24"
              />
            </div>
            <label className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-prose-muted text-xs font-medium">{t("form.fee")}</span>
                <span className="text-primary text-[11px] font-semibold tabular-nums">
                  {formattedFeePreview}
                </span>
              </div>
              <Input
                variant="glass"
                size="sm"
                type="number"
                min={0}
                step={1000}
                required
                value={entryFeeSyp}
                onChange={(event) => setEntryFeeSyp(event.target.value)}
                label={t("form.fee")}
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-prose-muted text-xs font-medium">{t("form.latitude")}</span>
              <Input
                variant="glass"
                size="sm"
                type="number"
                required
                step="any"
                value={latitude}
                onChange={(event) => setLatitude(event.target.value)}
                label={t("form.latitude")}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-prose-muted text-xs font-medium">{t("form.longitude")}</span>
              <Input
                variant="glass"
                size="sm"
                type="number"
                required
                step="any"
                value={longitude}
                onChange={(event) => setLongitude(event.target.value)}
                label={t("form.longitude")}
              />
            </label>
          </div>
        </div>

        <div className="border-glass-border/60 flex shrink-0 justify-end gap-2 border-t pt-3">
          <Button type="button" variant="glass" size="sm" onClick={dismiss}>
            {t("form.cancel")}
          </Button>
          <Button type="submit" size="sm" disabled={isPending}>
            {t("form.save")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
