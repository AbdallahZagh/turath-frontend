"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeCheck,
  Building2,
  Clock3,
  FileCheck2,
  ImagePlus,
  Mail,
  MapPin,
  Phone,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRef, type ReactNode } from "react";
import { Controller, useForm, useWatch, type FieldError } from "react-hook-form";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useUpdateProviderProfile } from "@/hooks/useProviderProfile";
import type { Locale } from "@/i18n/config";
import type { ProviderProfile } from "@/lib/mock/providerProfile";
import {
  PROVIDER_PROFILE_AMENITIES,
  providerProfileSchema,
  type ProviderProfileValues,
} from "@/lib/validation/providerProfile";
import { toast } from "@/store/toastStore";

const GOVERNORATES = [
  "damascus",
  "aleppo",
  "homs",
  "hama",
  "latakia",
  "tartus",
  "bosra",
  "palmyra",
] as const;

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: FieldError;
  children: ReactNode;
}): ReactNode {
  const t = useTranslations("provider.profile.errors");
  return (
    <label className="block min-w-0">
      <span className="text-prose-muted mb-1.5 block text-xs font-semibold">{label}</span>
      {children}
      {error?.message ? (
        <span className="text-destructive mt-1.5 block text-xs">
          {t(error.message as "required" | "description" | "phone" | "email" | "time" | "coordinate" | "gallery")}
        </span>
      ) : null}
    </label>
  );
}

function SectionHeading({ title, description }: { title: string; description: string }): ReactNode {
  return (
    <div>
      <h2 className="font-heading text-prose text-xl font-semibold">{title}</h2>
      <p className="text-prose-muted mt-1 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function ProfilePreview({ values, locale }: { values: ProviderProfileValues; locale: Locale }): ReactNode {
  const t = useTranslations("provider.profile");
  const name = locale === "ar" ? values.nameAr : values.nameEn;
  const description = locale === "ar" ? values.descriptionAr : values.descriptionEn;
  const address = locale === "ar" ? values.addressAr : values.addressEn;
  const cover = values.gallery[0] ?? values.logo;

  return (
    <GlassPanel className="overflow-hidden p-0 xl:sticky xl:top-24">
      <div className="relative h-52 bg-app-muted">
        {cover ? (
          <Image src={cover} alt="" fill unoptimized sizes="(min-width: 1280px) 22rem, 100vw" className="object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-overlay/70 to-transparent" />
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
          <div className="relative size-16 overflow-hidden rounded-2xl border-2 border-white/70 bg-white shadow-lg">
            {values.logo ? (
              <Image src={values.logo} alt="" fill unoptimized sizes="4rem" className="object-cover" />
            ) : null}
          </div>
          <Badge variant="glass" className="border-white/30 bg-overlay/45 text-white" icon={<BadgeCheck className="size-3.5" aria-hidden />}>
            {t("preview.verified")}
          </Badge>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <p className="text-primary text-xs font-bold uppercase tracking-[0.14em]">{t("preview.eyebrow")}</p>
        <h2 className="font-heading text-prose mt-2 text-2xl font-semibold">{name || t("preview.nameFallback")}</h2>
        <p className="text-prose-muted mt-2 text-sm leading-7">{description || t("preview.descriptionFallback")}</p>
        <dl className="border-border mt-5 space-y-3 border-t pt-5 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
            <span className="text-prose">{address}</span>
          </div>
          <div className="flex items-center gap-2" dir="ltr">
            <Phone className="text-primary size-4 shrink-0" aria-hidden />
            <span className="text-prose">{values.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3 className="text-primary size-4 shrink-0" aria-hidden />
            <span className="text-prose">{values.opensAt} – {values.closesAt}</span>
          </div>
        </dl>
      </div>
    </GlassPanel>
  );
}

export function ProviderProfileEditor({ profile }: { profile: ProviderProfile }): ReactNode {
  const t = useTranslations("provider.profile");
  const rawLocale = useLocale();
  const locale: Locale = rawLocale === "ar" ? "ar" : "en";
  const update = useUpdateProviderProfile();
  const logoInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const form = useForm<ProviderProfileValues>({
    resolver: zodResolver(providerProfileSchema),
    defaultValues: {
      nameEn: profile.nameEn,
      nameAr: profile.nameAr,
      descriptionEn: profile.descriptionEn,
      descriptionAr: profile.descriptionAr,
      governorate: profile.governorate,
      addressEn: profile.addressEn,
      addressAr: profile.addressAr,
      phone: profile.phone,
      email: profile.email,
      opensAt: profile.opensAt,
      closesAt: profile.closesAt,
      latitude: profile.latitude,
      longitude: profile.longitude,
      amenities: [...profile.amenities],
      logo: profile.logo,
      gallery: [...profile.gallery],
    },
  });
  const values = useWatch({ control: form.control });
  const gallery = useWatch({ control: form.control, name: "gallery" }) ?? profile.gallery;
  const previewValues: ProviderProfileValues = {
    nameEn: values.nameEn ?? profile.nameEn,
    nameAr: values.nameAr ?? profile.nameAr,
    descriptionEn: values.descriptionEn ?? profile.descriptionEn,
    descriptionAr: values.descriptionAr ?? profile.descriptionAr,
    governorate: values.governorate ?? profile.governorate,
    addressEn: values.addressEn ?? profile.addressEn,
    addressAr: values.addressAr ?? profile.addressAr,
    phone: values.phone ?? profile.phone,
    email: values.email ?? profile.email,
    opensAt: values.opensAt ?? profile.opensAt,
    closesAt: values.closesAt ?? profile.closesAt,
    latitude: values.latitude ?? profile.latitude,
    longitude: values.longitude ?? profile.longitude,
    amenities: values.amenities ?? profile.amenities,
    logo: values.logo ?? profile.logo,
    gallery,
  };

  function selectLogo(file: File | undefined): void {
    if (!file?.type.startsWith("image/")) return;
    form.setValue("logo", URL.createObjectURL(file), { shouldDirty: true, shouldValidate: true });
  }

  function addGallery(files: FileList | null): void {
    if (!files) return;
    const available = Math.max(6 - gallery.length, 0);
    const added = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, available)
      .map((file) => URL.createObjectURL(file));
    if (added.length > 0) {
      form.setValue("gallery", [...gallery, ...added], { shouldDirty: true, shouldValidate: true });
    }
  }

  function removeGallery(index: number): void {
    if (gallery.length <= 1) return;
    form.setValue(
      "gallery",
      gallery.filter((_, itemIndex) => itemIndex !== index),
      { shouldDirty: true, shouldValidate: true },
    );
  }

  function onSubmit(next: ProviderProfileValues): void {
    update.mutate(next, {
      onSuccess: (saved) => {
        form.reset({
          nameEn: saved.nameEn,
          nameAr: saved.nameAr,
          descriptionEn: saved.descriptionEn,
          descriptionAr: saved.descriptionAr,
          governorate: saved.governorate,
          addressEn: saved.addressEn,
          addressAr: saved.addressAr,
          phone: saved.phone,
          email: saved.email,
          opensAt: saved.opensAt,
          closesAt: saved.closesAt,
          latitude: saved.latitude,
          longitude: saved.longitude,
          amenities: [...saved.amenities],
          logo: saved.logo,
          gallery: [...saved.gallery],
        });
        toast.success(t("saved.title"), t("saved.description"));
      },
      onError: () => toast.error(t("saveError.title"), t("saveError.description")),
    });
  }

  return (
    <form className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]" noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex min-w-0 flex-col gap-5">
        <GlassPanel className="gap-6 p-5 sm:p-6">
          <SectionHeading
            title={t("registration.title")}
            description={t("registration.description")}
          />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="border-border bg-glass-control rounded-2xl border p-4">
              <Building2 className="text-primary size-5" aria-hidden />
              <p className="text-prose-muted mt-3 text-xs">{t("registration.category")}</p>
              <p className="text-prose mt-1 text-sm font-semibold">
                {t(`registration.categories.${profile.category}`)}
              </p>
            </div>
            {([
              ["commercialRegistration", profile.registration.commercialRegistration.filename],
              ["ministryLicense", profile.registration.ministryLicense.filename],
              ["ownerId", profile.registration.ownerId.filename],
            ] as const).map(([key, filename]) => (
              <div key={key} className="border-border bg-glass-control min-w-0 rounded-2xl border p-4">
                <FileCheck2 className="text-primary size-5" aria-hidden />
                <p className="text-prose-muted mt-3 text-xs">
                  {t(`registration.documents.${key}`)}
                </p>
                <p className="text-prose mt-1 truncate text-sm font-semibold" dir="ltr" title={filename}>
                  {filename}
                </p>
              </div>
            ))}
            {profile.category === "guides" ? (
              <div className="border-border bg-glass-control rounded-2xl border p-4">
                <FileCheck2 className="text-primary size-5" aria-hidden />
                <p className="text-prose-muted mt-3 text-xs">{t("registration.guideLicense")}</p>
                <p className="text-prose mt-1 text-sm font-semibold" dir="ltr">
                  {profile.registration.guideLicenseNumber}
                </p>
              </div>
            ) : null}
          </div>
        </GlassPanel>

        <GlassPanel className="gap-6 p-5 sm:p-6">
          <SectionHeading title={t("identity.title")} description={t("identity.description")} />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label={t("fields.nameEn")} error={form.formState.errors.nameEn}>
              <Input variant="glass" dir="ltr" {...form.register("nameEn")} />
            </FormField>
            <FormField label={t("fields.nameAr")} error={form.formState.errors.nameAr}>
              <Input variant="glass" dir="rtl" {...form.register("nameAr")} />
            </FormField>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label={t("fields.descriptionEn")} error={form.formState.errors.descriptionEn}>
              <Textarea variant="glass" dir="ltr" rows={5} {...form.register("descriptionEn")} />
            </FormField>
            <FormField label={t("fields.descriptionAr")} error={form.formState.errors.descriptionAr}>
              <Textarea variant="glass" dir="rtl" rows={5} {...form.register("descriptionAr")} />
            </FormField>
          </div>
        </GlassPanel>

        <GlassPanel className="gap-6 p-5 sm:p-6">
          <SectionHeading title={t("location.title")} description={t("location.description")} />
          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={form.control}
              name="governorate"
              render={({ field, fieldState }) => (
                <FormField label={t("fields.governorate")} error={fieldState.error}>
                  <Select
                    variant="glass"
                    value={field.value}
                    onChange={field.onChange}
                    options={GOVERNORATES.map((value) => ({ value, label: t(`governorates.${value}`) }))}
                  />
                </FormField>
              )}
            />
            <FormField label={t("fields.phone")} error={form.formState.errors.phone}>
              <Input variant="glass" dir="ltr" {...form.register("phone")} />
            </FormField>
            <FormField label={t("fields.addressEn")} error={form.formState.errors.addressEn}>
              <Input variant="glass" dir="ltr" {...form.register("addressEn")} />
            </FormField>
            <FormField label={t("fields.addressAr")} error={form.formState.errors.addressAr}>
              <Input variant="glass" dir="rtl" {...form.register("addressAr")} />
            </FormField>
            <FormField label={t("fields.email")} error={form.formState.errors.email}>
              <Input variant="glass" type="email" dir="ltr" {...form.register("email")} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={t("fields.opensAt")} error={form.formState.errors.opensAt}>
                <Input variant="glass" type="time" {...form.register("opensAt")} />
              </FormField>
              <FormField label={t("fields.closesAt")} error={form.formState.errors.closesAt}>
                <Input variant="glass" type="time" {...form.register("closesAt")} />
              </FormField>
            </div>
            <FormField label={t("fields.latitude")} error={form.formState.errors.latitude}>
              <Input variant="glass" inputMode="decimal" dir="ltr" {...form.register("latitude")} />
            </FormField>
            <FormField label={t("fields.longitude")} error={form.formState.errors.longitude}>
              <Input variant="glass" inputMode="decimal" dir="ltr" {...form.register("longitude")} />
            </FormField>
          </div>
          <div className="border-border bg-glass-control flex items-start gap-3 rounded-2xl border p-4">
            <MapPin className="text-primary mt-0.5 size-5 shrink-0" aria-hidden />
            <div>
              <p className="text-prose text-sm font-semibold">{t("location.pinTitle")}</p>
              <p className="text-prose-muted mt-1 text-xs" dir="ltr">{previewValues.latitude}, {previewValues.longitude}</p>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="gap-6 p-5 sm:p-6">
          <SectionHeading title={t("amenities.title")} description={t("amenities.description")} />
          <Controller
            control={form.control}
            name="amenities"
            render={({ field }) => (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {PROVIDER_PROFILE_AMENITIES.map((amenity) => (
                  <label key={amenity} className="border-border bg-glass-control text-prose flex items-center gap-3 rounded-xl border px-4 py-3 text-sm">
                    <Checkbox
                      checked={field.value.includes(amenity)}
                      onChange={(event) =>
                        field.onChange(
                          event.target.checked
                            ? [...field.value, amenity]
                            : field.value.filter((value) => value !== amenity),
                        )
                      }
                    />
                    {t(`amenities.options.${amenity}`)}
                  </label>
                ))}
              </div>
            )}
          />
        </GlassPanel>

        <GlassPanel className="gap-6 p-5 sm:p-6">
          <SectionHeading title={t("media.title")} description={t("media.description")} />
          <div>
            <p className="text-prose-muted mb-2 text-xs font-semibold">{t("media.logo")}</p>
            <p className="text-prose-muted mb-3 truncate text-xs" dir="ltr">
              {profile.registration.logoFilename}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative size-24 overflow-hidden rounded-2xl border border-border bg-app-muted">
                <Image src={previewValues.logo} alt={t("media.logoAlt")} fill unoptimized sizes="6rem" className="object-cover" />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => logoInput.current?.click()}>
                <Upload className="size-4" aria-hidden />
                {t("media.replaceLogo")}
              </Button>
              <input ref={logoInput} type="file" accept="image/*" className="sr-only" onChange={(event) => selectLogo(event.target.files?.[0])} />
            </div>
          </div>
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-prose text-sm font-semibold">{t("media.gallery")}</p>
                <p className="text-prose-muted mt-1 text-xs">{t("media.galleryHint", { count: gallery.length })}</p>
                <p className="text-prose-muted mt-1 text-xs" dir="ltr">
                  {profile.registration.galleryFilenames.join(", ")}
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" disabled={gallery.length >= 6} onClick={() => galleryInput.current?.click()}>
                <ImagePlus className="size-4" aria-hidden />
                {t("media.addPhotos")}
              </Button>
              <input ref={galleryInput} type="file" accept="image/*" multiple className="sr-only" onChange={(event) => addGallery(event.target.files)} />
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {gallery.map((src, index) => (
                <div key={src} className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-app-muted">
                  <Image src={src} alt={t("media.galleryAlt", { number: index + 1 })} fill unoptimized sizes="(min-width: 768px) 14rem, 45vw" className="object-cover" />
                  <button
                    type="button"
                    disabled={gallery.length <= 1}
                    onClick={() => removeGallery(index)}
                    className="bg-overlay/70 text-white absolute end-2 top-2 grid size-9 place-items-center rounded-full transition-opacity disabled:hidden md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                    aria-label={t("media.removePhoto", { number: index + 1 })}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
              ))}
            </div>
            {form.formState.errors.gallery ? <p className="text-destructive mt-2 text-xs">{t("errors.gallery")}</p> : null}
          </div>
        </GlassPanel>

        <div className="flex justify-end">
          <Button type="submit" disabled={update.isPending || !form.formState.isDirty}>
            <Save className="size-4" aria-hidden />
            {update.isPending ? t("saving") : t("save")}
          </Button>
        </div>
      </div>

      <aside>
        <ProfilePreview values={previewValues} locale={locale} />
        <GlassPanel className="mt-5 p-5">
          <div className="flex items-center gap-2">
            <Mail className="text-primary size-4" aria-hidden />
            <p className="text-prose text-sm font-semibold">{t("preview.publicContact")}</p>
          </div>
          <p className="text-prose-muted mt-2 break-all text-xs" dir="ltr">{previewValues.email}</p>
        </GlassPanel>
      </aside>
    </form>
  );
}
