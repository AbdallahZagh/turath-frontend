"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, CheckCircle2, FileCheck2, ImagePlus, MapPin, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { Button } from "@/components/ui/Button";
import { FileField } from "@/components/ui/FileField";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ImageField } from "@/components/ui/ImageField";
import { Input } from "@/components/ui/Input";
import { TimePicker } from "@/components/ui/TimePicker";
import { PROVIDER_PATHS } from "@/config/providerRoutes";
import { providerOnboardingSchema, type ProviderOnboardingValues } from "@/lib/validation/auth";
import { fieldMessage, fieldMessageFromUnknown } from "@/lib/validation/fieldMessage";
import { toast } from "@/store/toastStore";

const GALLERY_MAX = 6;

export function ProviderOnboardingForm(): ReactNode {
  const t = useTranslations("providerOnboarding");
  const tRegister = useTranslations("providerRegister");
  const tErrors = useTranslations("auth.errors");
  const router = useRouter();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string>();
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const form = useForm<ProviderOnboardingValues>({
    resolver: zodResolver(providerOnboardingSchema),
    defaultValues: {
      addressEn: "",
      addressAr: "",
      opensAt: "09:00",
      closesAt: "22:00",
      gallery: [],
    },
  });
  const gallery = useWatch({ control: form.control, name: "gallery" }) ?? [];

  function addGallery(event: ChangeEvent<HTMLInputElement>): void {
    const incoming = Array.from(event.target.files ?? []).slice(0, GALLERY_MAX - gallery.length);
    if (incoming.length === 0) return;
    form.setValue("gallery", [...gallery, ...incoming], {
      shouldValidate: true,
      shouldDirty: true,
    });
    setGalleryPreviews((current) => [
      ...current,
      ...incoming.map((file) => URL.createObjectURL(file)),
    ]);
    event.target.value = "";
  }

  function removeGallery(index: number): void {
    form.setValue(
      "gallery",
      gallery.filter((_, itemIndex) => itemIndex !== index),
      { shouldValidate: true, shouldDirty: true },
    );
    setGalleryPreviews((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function submit(): void {
    toast.success(t("successTitle"), t("successBody"));
    router.push(PROVIDER_PATHS.pending);
  }

  return (
    <div className="w-full max-w-5xl py-4 sm:py-8">
      <div className="mb-6 text-center sm:text-start">
        <span className="bg-primary/12 text-primary mx-auto grid size-12 place-items-center rounded-2xl sm:mx-0">
          <Building2 className="size-6" aria-hidden />
        </span>
        <h1 className="font-heading text-prose mt-4 text-3xl font-semibold sm:text-4xl">
          {t("title")}
        </h1>
        <p className="text-prose-muted mx-auto mt-2 max-w-2xl text-sm leading-relaxed sm:mx-0">
          {t("lead")}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(submit)} className="space-y-5" noValidate>
        <GlassPanel className="p-4 sm:p-6">
          <div className="mb-5 flex items-start gap-3">
            <span className="bg-primary/12 text-primary grid size-10 shrink-0 place-items-center rounded-xl">
              <MapPin className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="font-heading text-prose text-xl font-semibold">
                {t("locationTitle")}
              </h2>
              <p className="text-prose-muted text-sm">{t("locationBody")}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Input
                {...form.register("addressEn")}
                variant="main"
                label={tRegister("addressEn")}
                dir="ltr"
              />
              <AuthFieldError message={fieldMessage(tErrors, form.formState.errors.addressEn)} />
            </div>
            <div className="space-y-1.5">
              <Input
                {...form.register("addressAr")}
                variant="main"
                label={tRegister("addressAr")}
                dir="rtl"
              />
              <AuthFieldError message={fieldMessage(tErrors, form.formState.errors.addressAr)} />
            </div>
            <div className="space-y-1.5">
              <Controller
                control={form.control}
                name="opensAt"
                render={({ field }) => (
                  <TimePicker
                    variant="main"
                    label={tRegister("opensAt")}
                    value={field.value}
                    onChange={field.onChange}
                    minuteStep={15}
                  />
                )}
              />
              <AuthFieldError message={fieldMessage(tErrors, form.formState.errors.opensAt)} />
            </div>
            <div className="space-y-1.5">
              <Controller
                control={form.control}
                name="closesAt"
                render={({ field }) => (
                  <TimePicker
                    variant="main"
                    label={tRegister("closesAt")}
                    value={field.value}
                    onChange={field.onChange}
                    minuteStep={15}
                  />
                )}
              />
              <AuthFieldError message={fieldMessage(tErrors, form.formState.errors.closesAt)} />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-4 sm:p-6">
          <div className="mb-5 flex items-start gap-3">
            <span className="bg-primary/12 text-primary grid size-10 shrink-0 place-items-center rounded-xl">
              <FileCheck2 className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="font-heading text-prose text-xl font-semibold">
                {t("documentsTitle")}
              </h2>
              <p className="text-prose-muted text-sm">{t("documentsBody")}</p>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {(["commercialRegistration", "ministryLicense", "ownerId"] as const).map((name) => (
              <div key={name} className="space-y-1.5">
                <Controller
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FileField
                      label={tRegister(name)}
                      hint={tRegister("documentHint")}
                      removeLabel={tRegister("removeFile")}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <AuthFieldError message={fieldMessage(tErrors, form.formState.errors[name])} />
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-4 sm:p-6">
          <div className="mb-5 flex items-start gap-3">
            <span className="bg-primary/12 text-primary grid size-10 shrink-0 place-items-center rounded-xl">
              <ImagePlus className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="font-heading text-prose text-xl font-semibold">{t("photosTitle")}</h2>
              <p className="text-prose-muted text-sm">{t("photosBody")}</p>
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
            <div className="space-y-1.5">
              <Controller
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <ImageField
                    label={tRegister("logo")}
                    hint={tRegister("logoHint")}
                    removeLabel={tRegister("removeFile")}
                    value={logoPreview}
                    onChange={(file, preview) => {
                      field.onChange(file);
                      setLogoPreview(preview);
                    }}
                  />
                )}
              />
              <AuthFieldError message={fieldMessage(tErrors, form.formState.errors.logo)} />
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {galleryPreviews.map((preview, index) => (
                  <div
                    key={preview}
                    className="border-glass-border relative aspect-video overflow-hidden rounded-2xl border"
                  >
                    <Image src={preview} alt="" fill unoptimized className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGallery(index)}
                      aria-label={tRegister("removeFile")}
                      className="bg-ink/75 text-foam absolute end-2 top-2 grid size-8 place-items-center rounded-full"
                    >
                      <X className="size-4" aria-hidden />
                    </button>
                  </div>
                ))}
                {gallery.length < GALLERY_MAX ? (
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="border-glass-border bg-glass-control text-prose-muted hover:text-prose flex aspect-video flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-3 text-sm"
                  >
                    <ImagePlus className="size-5" aria-hidden />
                    {tRegister("addPhoto")}
                  </button>
                ) : null}
              </div>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                onChange={addGallery}
              />
              <AuthFieldError
                message={fieldMessageFromUnknown(tErrors, form.formState.errors.gallery)}
              />
            </div>
          </div>
        </GlassPanel>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button href={PROVIDER_PATHS.pending} variant="outline" className="w-full sm:w-auto">
            {t("saveLater")}
          </Button>
          <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
            <CheckCircle2 className="size-4" aria-hidden />
            {t("submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}
